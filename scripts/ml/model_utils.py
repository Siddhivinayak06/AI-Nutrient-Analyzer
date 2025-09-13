"""
ml/model_utils.py
Helper functions for model preprocessing and inference
"""

import os
import numpy as np
import joblib
import tensorflow as tf

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_saved")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")
FEATURE_INFO_PATH = os.path.join(MODEL_DIR, "feature_info.joblib")

def load_model_and_scaler():
    """Load the trained model, scaler, and feature info"""
    try:
        model = tf.keras.models.load_model(MODEL_DIR)
        scaler = joblib.load(SCALER_PATH)
        feature_info = joblib.load(FEATURE_INFO_PATH)
        return model, scaler, feature_info
    except Exception as e:
        raise RuntimeError(f"Failed to load model components: {e}")

def preprocess_input(payload, scaler, feature_info):
    """
    Preprocess input payload for model prediction
    
    Args:
        payload: dict with keys:
            calories, protein, carbs, fat, iron, vitaminC, age, gender (0/1), 
            dosha (one of 'VATA','PITTA','KAPHA' OR 0/1/2)
        scaler: fitted StandardScaler
        feature_info: feature information dict
    
    Returns:
        numpy array shaped (1, input_dim) ready for model prediction
    """
    # Handle dosha input
    dosha_map = {"VATA": 0, "PITTA": 1, "KAPHA": 2}
    dosha = payload.get("dosha", 0)
    
    if isinstance(dosha, str):
        dosha_idx = dosha_map.get(dosha.upper(), 0)
    else:
        dosha_idx = int(dosha)
    
    # Create one-hot encoding for dosha
    dosha_ohe = [0, 0, 0]
    dosha_ohe[dosha_idx] = 1
    
    # Extract numeric features in correct order
    numeric_features = [
        float(payload.get("calories", 0.0)),
        float(payload.get("protein", 0.0)),
        float(payload.get("carbs", 0.0)),
        float(payload.get("fat", 0.0)),
        float(payload.get("iron", 0.0)),
        float(payload.get("vitaminC", 0.0)),
        float(payload.get("age", 30)),
        float(payload.get("gender", 0))
    ]
    
    # Convert to numpy array and scale
    x_numeric = np.array(numeric_features, dtype=np.float32).reshape(1, -1)
    x_numeric_scaled = scaler.transform(x_numeric)
    
    # Combine scaled numeric features with dosha one-hot encoding
    x_full = np.concatenate([
        x_numeric_scaled, 
        np.array(dosha_ohe, dtype=np.float32).reshape(1, -1)
    ], axis=1)
    
    return x_full

def interpret_predictions(predictions, feature_info):
    """
    Interpret model predictions and generate human-readable insights
    
    Args:
        predictions: numpy array of shape (1, 3) with probabilities
        feature_info: feature information dict
    
    Returns:
        dict with interpreted results
    """
    pred_probs = predictions[0]  # Get first (and only) prediction
    
    # Map predictions to labels
    labels = feature_info['output_labels']
    results = {}
    
    for i, label in enumerate(labels):
        results[label] = {
            'probability': float(pred_probs[i]),
            'risk_level': get_risk_level(pred_probs[i]),
            'confidence': get_confidence_level(pred_probs[i])
        }
    
    return results

def get_risk_level(probability):
    """Convert probability to risk level"""
    if probability < 0.3:
        return "low"
    elif probability < 0.6:
        return "moderate"
    else:
        return "high"

def get_confidence_level(probability):
    """Assess confidence based on how far probability is from 0.5"""
    distance_from_uncertain = abs(probability - 0.5)
    if distance_from_uncertain > 0.4:
        return "high"
    elif distance_from_uncertain > 0.2:
        return "medium"
    else:
        return "low"

def generate_recommendations(predictions, payload, feature_info):
    """
    Generate personalized recommendations based on predictions and user profile
    
    Args:
        predictions: model predictions
        payload: original input payload
        feature_info: feature information
    
    Returns:
        list of recommendation strings
    """
    recommendations = []
    interpreted = interpret_predictions(predictions, feature_info)
    
    # Iron deficiency recommendations
    if interpreted['iron_def']['risk_level'] in ['moderate', 'high']:
        recommendations.append(
            "Consider increasing iron-rich foods like spinach, lentils, and pumpkin seeds. "
            "Pair with vitamin C sources for better absorption."
        )
    
    # Vitamin C deficiency recommendations
    if interpreted['vitc_def']['risk_level'] in ['moderate', 'high']:
        recommendations.append(
            "Increase vitamin C intake with citrus fruits, bell peppers, or amla. "
            "Fresh fruits are better than supplements when possible."
        )
    
    # Protein deficiency recommendations
    if interpreted['protein_def']['risk_level'] in ['moderate', 'high']:
        recommendations.append(
            "Consider adding more protein sources like legumes, nuts, seeds, or lean meats "
            "depending on your dietary preferences."
        )
    
    # Dosha-specific recommendations
    dosha = payload.get('dosha', 'VATA')
    if isinstance(dosha, int):
        dosha = ['VATA', 'PITTA', 'KAPHA'][dosha]
    
    dosha_recs = get_dosha_recommendations(dosha.upper(), interpreted)
    recommendations.extend(dosha_recs)
    
    return recommendations

def get_dosha_recommendations(dosha, interpreted_predictions):
    """Generate dosha-specific recommendations"""
    recommendations = []
    
    if dosha == 'VATA':
        recommendations.append(
            "For Vata constitution: Focus on warm, cooked foods and regular meal times. "
            "Include healthy fats like ghee and nuts."
        )
        if interpreted_predictions['iron_def']['risk_level'] != 'low':
            recommendations.append(
                "Vata types benefit from iron-rich foods cooked with warming spices like ginger."
            )
    
    elif dosha == 'PITTA':
        recommendations.append(
            "For Pitta constitution: Favor cooling foods and avoid excessive spicy or acidic items. "
            "Include sweet, bitter, and astringent tastes."
        )
        if interpreted_predictions['vitc_def']['risk_level'] != 'low':
            recommendations.append(
                "Pitta types should focus on cooling vitamin C sources like sweet fruits."
            )
    
    elif dosha == 'KAPHA':
        recommendations.append(
            "For Kapha constitution: Choose light, warm, and spicy foods. "
            "Reduce heavy, oily, and sweet foods."
        )
        if interpreted_predictions['protein_def']['risk_level'] != 'low':
            recommendations.append(
                "Kapha types benefit from light proteins like legumes and lean meats with spices."
            )
    
    return recommendations
