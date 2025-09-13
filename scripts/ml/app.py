"""
ml/app.py
FastAPI inference server for nutrient deficiency prediction
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import numpy as np
import logging
from .model_utils import load_model_and_scaler, preprocess_input, interpret_predictions, generate_recommendations

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Nutrient Analyzer - ML Service",
    description="Machine learning service for nutrient deficiency prediction and Ayurvedic recommendations",
    version="1.0.0"
)

class MealRequest(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float
    iron: Optional[float] = 0.0
    vitaminC: Optional[float] = 0.0
    age: Optional[int] = 30
    gender: Optional[int] = 0  # 0 female, 1 male
    dosha: Optional[str] = "VATA"

class PredictionResponse(BaseModel):
    probabilities: dict
    risk_assessment: dict
    suggestions: list
    confidence_scores: dict

# Global variables for model components
model = None
scaler = None
feature_info = None

@app.on_event("startup")
async def load_model():
    """Load model components on startup"""
    global model, scaler, feature_info
    try:
        model, scaler, feature_info = load_model_and_scaler()
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "AI Nutrient Analyzer ML Service",
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "feature_info_loaded": feature_info is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(meal: MealRequest):
    """
    Predict nutrient deficiency probabilities for a given meal and user profile
    """
    if model is None or scaler is None or feature_info is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Preprocess input
        x = preprocess_input(meal.dict(), scaler, feature_info)
        
        # Make prediction
        predictions = model.predict(x, verbose=0)
        
        # Interpret results
        interpreted = interpret_predictions(predictions, feature_info)
        
        # Generate recommendations
        suggestions = generate_recommendations(predictions, meal.dict(), feature_info)
        
        # Prepare response
        probabilities = {
            "iron_def": float(predictions[0][0]),
            "vitc_def": float(predictions[0][1]),
            "protein_def": float(predictions[0][2])
        }
        
        risk_assessment = {
            label: data['risk_level'] 
            for label, data in interpreted.items()
        }
        
        confidence_scores = {
            label: data['confidence'] 
            for label, data in interpreted.items()
        }
        
        return PredictionResponse(
            probabilities=probabilities,
            risk_assessment=risk_assessment,
            suggestions=suggestions,
            confidence_scores=confidence_scores
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/batch-predict")
async def batch_predict(meals: list[MealRequest]):
    """
    Predict nutrient deficiencies for multiple meals
    """
    if model is None or scaler is None or feature_info is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        results = []
        
        for i, meal in enumerate(meals):
            try:
                # Process each meal
                x = preprocess_input(meal.dict(), scaler, feature_info)
                predictions = model.predict(x, verbose=0)
                interpreted = interpret_predictions(predictions, feature_info)
                suggestions = generate_recommendations(predictions, meal.dict(), feature_info)
                
                results.append({
                    "meal_index": i,
                    "probabilities": {
                        "iron_def": float(predictions[0][0]),
                        "vitc_def": float(predictions[0][1]),
                        "protein_def": float(predictions[0][2])
                    },
                    "risk_assessment": {
                        label: data['risk_level'] 
                        for label, data in interpreted.items()
                    },
                    "suggestions": suggestions,
                    "status": "success"
                })
                
            except Exception as e:
                results.append({
                    "meal_index": i,
                    "error": str(e),
                    "status": "error"
                })
        
        return {
            "results": results,
            "summary": {
                "total": len(meals),
                "successful": len([r for r in results if r["status"] == "success"]),
                "failed": len([r for r in results if r["status"] == "error"])
            }
        }
        
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
