"""
ml/evaluate_model.py
Evaluate the trained model performance and generate metrics
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, roc_curve
from sklearn.model_selection import train_test_split
import joblib
import tensorflow as tf
from model_utils import load_model_and_scaler, preprocess_input

def load_test_data(csv_path=None):
    """Load test data (same format as training data)"""
    if csv_path and os.path.exists(csv_path):
        return pd.read_csv(csv_path)
    else:
        # Generate synthetic test data
        print("Generating synthetic test data...")
        n = 2000
        rng = np.random.RandomState(123)  # Different seed for test data
        
        calories = rng.normal(600, 200, n).clip(100, 3000)
        protein = rng.normal(40, 20, n).clip(0, 200)
        carbs = rng.normal(80, 40, n).clip(0, 400)
        fat = rng.normal(30, 15, n).clip(0, 150)
        iron = rng.normal(8, 4, n).clip(0, 30)
        vitaminC = rng.normal(35, 20, n).clip(0, 200)
        age = rng.randint(16, 80, n)
        gender = rng.randint(0, 2, n)
        dosha = rng.randint(0, 3, n)
        
        iron_threshold = np.where(gender == 0, 15, 10)
        iron_def = (iron < (iron_threshold + rng.normal(0, 2, n))).astype(int)
        
        vitc_threshold = 30 + rng.normal(0, 5, n)
        vitc_def = (vitaminC < vitc_threshold).astype(int)
        
        protein_threshold = np.where(gender == 0, 46, 56)
        protein_def = (protein < (protein_threshold + rng.normal(0, 5, n))).astype(int)
        
        return pd.DataFrame({
            "calories": calories,
            "protein": protein,
            "carbs": carbs,
            "fat": fat,
            "iron": iron,
            "vitaminC": vitaminC,
            "age": age,
            "gender": gender,
            "dosha": dosha,
            "iron_def": iron_def,
            "vitc_def": vitc_def,
            "protein_def": protein_def
        })

def prepare_test_features(df):
    """Prepare test features in the same way as training data"""
    feature_cols = ["calories", "protein", "carbs", "fat", "iron", "vitaminC", "age", "gender"]
    X_numeric = df[feature_cols].values.astype(np.float32)
    
    dosha = df["dosha"].astype(int).values
    dosha_ohe = tf.keras.utils.to_categorical(dosha, num_classes=3).astype(np.float32)
    
    X = np.concatenate([X_numeric, dosha_ohe], axis=1)
    y = df[["iron_def", "vitc_def", "protein_def"]].values.astype(np.float32)
    
    return X, y

def evaluate_model(model, scaler, X_test, y_test, feature_info):
    """Comprehensive model evaluation"""
    print("🔍 Evaluating model performance...")
    
    # Scale test features
    X_test_scaled = X_test.copy()
    X_test_scaled[:, :8] = scaler.transform(X_test[:, :8])
    
    # Make predictions
    y_pred_proba = model.predict(X_test_scaled, verbose=0)
    y_pred = (y_pred_proba > 0.5).astype(int)
    
    # Calculate metrics for each output
    labels = feature_info['output_labels']
    results = {}
    
    for i, label in enumerate(labels):
        print(f"\n📊 {label.upper()} DEFICIENCY METRICS:")
        print("=" * 40)
        
        # Classification report
        report = classification_report(y_test[:, i], y_pred[:, i], output_dict=True)
        print(classification_report(y_test[:, i], y_pred[:, i]))
        
        # AUC Score
        auc = roc_auc_score(y_test[:, i], y_pred_proba[:, i])
        print(f"AUC Score: {auc:.4f}")
        
        # Store results
        results[label] = {
            'classification_report': report,
            'auc_score': auc,
            'y_true': y_test[:, i],
            'y_pred': y_pred[:, i],
            'y_pred_proba': y_pred_proba[:, i]
        }
    
    return results

def plot_evaluation_metrics(results, save_path="model_evaluation.png"):
    """Create visualization of model performance"""
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig.suptitle('Model Performance Evaluation', fontsize=16)
    
    labels = list(results.keys())
    
    # ROC Curves
    for i, label in enumerate(labels):
        ax = axes[0, i]
        fpr, tpr, _ = roc_curve(results[label]['y_true'], results[label]['y_pred_proba'])
        auc = results[label]['auc_score']
        
        ax.plot(fpr, tpr, label=f'ROC Curve (AUC = {auc:.3f})')
        ax.plot([0, 1], [0, 1], 'k--', label='Random')
        ax.set_xlabel('False Positive Rate')
        ax.set_ylabel('True Positive Rate')
        ax.set_title(f'{label.replace("_", " ").title()} - ROC Curve')
        ax.legend()
        ax.grid(True)
    
    # Confusion Matrices
    for i, label in enumerate(labels):
        ax = axes[1, i]
        cm = confusion_matrix(results[label]['y_true'], results[label]['y_pred'])
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
        ax.set_title(f'{label.replace("_", " ").title()} - Confusion Matrix')
        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"📈 Evaluation plots saved to: {save_path}")
    
    return fig

def generate_evaluation_report(results, save_path="evaluation_report.txt"):
    """Generate a comprehensive evaluation report"""
    with open(save_path, 'w') as f:
        f.write("AI NUTRIENT ANALYZER - MODEL EVALUATION REPORT\n")
        f.write("=" * 50 + "\n\n")
        
        # Overall summary
        f.write("OVERALL PERFORMANCE SUMMARY\n")
        f.write("-" * 30 + "\n")
        
        avg_auc = np.mean([results[label]['auc_score'] for label in results])
        f.write(f"Average AUC Score: {avg_auc:.4f}\n\n")
        
        # Individual metrics
        for label in results:
            f.write(f"{label.upper()} DEFICIENCY PREDICTION\n")
            f.write("-" * 30 + "\n")
            
            report = results[label]['classification_report']
            f.write(f"AUC Score: {results[label]['auc_score']:.4f}\n")
            f.write(f"Precision: {report['1']['precision']:.4f}\n")
            f.write(f"Recall: {report['1']['recall']:.4f}\n")
            f.write(f"F1-Score: {report['1']['f1-score']:.4f}\n")
            f.write(f"Support: {report['1']['support']}\n\n")
        
        # Recommendations
        f.write("RECOMMENDATIONS\n")
        f.write("-" * 15 + "\n")
        
        if avg_auc > 0.8:
            f.write("✅ Model performance is excellent (AUC > 0.8)\n")
        elif avg_auc > 0.7:
            f.write("⚠️  Model performance is good but could be improved (AUC > 0.7)\n")
            f.write("   Consider: More training data, feature engineering, hyperparameter tuning\n")
        else:
            f.write("❌ Model performance needs improvement (AUC < 0.7)\n")
            f.write("   Consider: Data quality review, feature selection, model architecture changes\n")
    
    print(f"📄 Evaluation report saved to: {save_path}")

def main(test_csv_path=None):
    """Main evaluation function"""
    print("🚀 Starting model evaluation...")
    
    try:
        # Load model components
        model, scaler, feature_info = load_model_and_scaler()
        print("✅ Model loaded successfully")
        
        # Load test data
        test_df = load_test_data(test_csv_path)
        print(f"📊 Test data loaded: {len(test_df)} samples")
        
        # Prepare test features
        X_test, y_test = prepare_test_features(test_df)
        print("🔧 Test features prepared")
        
        # Evaluate model
        results = evaluate_model(model, scaler, X_test, y_test, feature_info)
        
        # Generate visualizations
        plot_evaluation_metrics(results)
        
        # Generate report
        generate_evaluation_report(results)
        
        print("✅ Model evaluation completed successfully!")
        
    except Exception as e:
        print(f"❌ Evaluation failed: {e}")
        raise

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Evaluate trained model')
    parser.add_argument("--test-csv", help="Path to test dataset CSV", default=None)
    args = parser.parse_args()
    
    main(args.test_csv)
