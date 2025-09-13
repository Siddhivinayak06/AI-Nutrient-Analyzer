#!/bin/bash

# ML Model Training Script
# This script sets up the environment and trains the nutrient deficiency prediction model

set -e  # Exit on any error

echo "🚀 Starting AI Nutrient Analyzer ML Training"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing requirements..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if custom dataset is provided
DATASET_PATH=""
if [ "$1" != "" ]; then
    if [ -f "$1" ]; then
        DATASET_PATH="--csv $1"
        echo "📊 Using custom dataset: $1"
    else
        echo "⚠️  Dataset file not found: $1"
        echo "📊 Using synthetic dataset for training"
    fi
else
    echo "📊 No dataset provided, using synthetic data"
fi

# Train the model
echo "🧠 Starting model training..."
python train.py $DATASET_PATH

# Check if model was created successfully
if [ -d "model_saved" ] && [ -f "model_saved/saved_model.pb" ]; then
    echo "✅ Model training completed successfully!"
    echo "📁 Model saved in: model_saved/"
    
    # Display model info
    echo "📋 Model files:"
    ls -la model_saved/
    
    echo ""
    echo "🚀 To start the ML service:"
    echo "   uvicorn app:app --reload --port 8000"
    echo ""
    echo "🐳 Or using Docker:"
    echo "   docker-compose up --build"
    
else
    echo "❌ Model training failed!"
    exit 1
fi

echo "🎉 Training script completed!"
