"""
ml/train.py

Train a multi-output TensorFlow model to predict likely nutrient deficiencies
(iron, vitamin C, protein) from meal nutrient values + user features.
Saves:
 - SavedModel at ./model_saved/
 - scaler at ./model_saved/scaler.joblib
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import tensorflow as tf

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_saved")
os.makedirs(MODEL_DIR, exist_ok=True)

def load_dataset(csv_path=None):
    """Load dataset from CSV or generate synthetic data for prototyping"""
    if csv_path and os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        # Expect columns: calories, protein, carbs, fat, iron, vitaminC, age, gender, dosha
        # and optionally labels: iron_def, vitc_def, protein_def
    else:
        # Generate synthetic data for demonstration
        print("Generating synthetic dataset for training...")
        n = 10000
        rng = np.random.RandomState(42)
        
        # Generate realistic nutrient values
        calories = rng.normal(600, 200, n).clip(100, 3000)
        protein = rng.normal(40, 20, n).clip(0, 200)
        carbs = rng.normal(80, 40, n).clip(0, 400)
        fat = rng.normal(30, 15, n).clip(0, 150)
        iron = rng.normal(8, 4, n).clip(0, 30)  # mg
        vitaminC = rng.normal(35, 20, n).clip(0, 200)  # mg
        age = rng.randint(16, 80, n)
        gender = rng.randint(0, 2, n)  # 0 female, 1 male
        dosha = rng.randint(0, 3, n)  # 0 VATA, 1 PITTA, 2 KAPHA
        
        # Generate deficiency labels based on realistic thresholds
        iron_threshold = np.where(gender == 0, 15, 10)  # Higher for females
        iron_def = (iron < (iron_threshold + rng.normal(0, 2, n))).astype(int)
        
        vitc_threshold = 30 + rng.normal(0, 5, n)
        vitc_def = (vitaminC < vitc_threshold).astype(int)
        
        protein_threshold = np.where(gender == 0, 46, 56)  # RDA differences
        protein_def = (protein < (protein_threshold + rng.normal(0, 5, n))).astype(int)
        
        df = pd.DataFrame({
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
    
    return df

def prepare_features(df):
    """Prepare features and labels for training"""
    feature_cols = ["calories", "protein", "carbs", "fat", "iron", "vitaminC", "age", "gender"]
    X_numeric = df[feature_cols].values.astype(np.float32)
    
    # One-hot encode dosha
    dosha = df["dosha"].astype(int).values
    dosha_ohe = tf.keras.utils.to_categorical(dosha, num_classes=3).astype(np.float32)
    
    # Combine numeric and categorical features
    X = np.concatenate([X_numeric, dosha_ohe], axis=1)
    
    # Prepare labels
    y = df[["iron_def", "vitc_def", "protein_def"]].values.astype(np.float32)
    
    return X, y, feature_cols

def build_model(input_dim):
    """Build and compile the neural network model"""
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(3, activation='sigmoid')  # 3 binary outputs
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy', 'precision', 'recall']
    )
    
    return model

def main(csv_path=None):
    """Main training function"""
    print("Starting ML model training...")
    
    # Load and prepare data
    df = load_dataset(csv_path)
    print(f"Dataset loaded with {len(df)} samples")
    
    X, y, feature_cols = prepare_features(df)
    print(f"Features prepared: {X.shape}, Labels: {y.shape}")
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.15, random_state=42, stratify=y[:, 0]  # Stratify on iron deficiency
    )
    
    # Scale numeric features (first 8 columns)
    scaler = StandardScaler()
    X_train[:, :8] = scaler.fit_transform(X_train[:, :8])
    X_val[:, :8] = scaler.transform(X_val[:, :8])
    
    print("Data preprocessing completed")
    
    # Build model
    model = build_model(X_train.shape[1])
    print("Model architecture:")
    model.summary()
    
    # Training callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss', 
            patience=10, 
            restore_best_weights=True,
            verbose=1
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-6,
            verbose=1
        ),
        tf.keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_DIR, 'best_model.h5'),
            monitor='val_loss',
            save_best_only=True,
            verbose=1
        )
    ]
    
    # Train model
    print("Starting training...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=100,
        batch_size=128,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate model
    print("\nEvaluating model...")
    val_loss, val_acc, val_precision, val_recall = model.evaluate(X_val, y_val, verbose=0)
    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_acc:.4f}")
    print(f"Validation Precision: {val_precision:.4f}")
    print(f"Validation Recall: {val_recall:.4f}")
    
    # Save model and scaler
    model.save(MODEL_DIR)
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler.joblib"))
    
    # Save feature names for reference
    feature_info = {
        'numeric_features': feature_cols,
        'dosha_encoding': ['VATA', 'PITTA', 'KAPHA'],
        'output_labels': ['iron_def', 'vitc_def', 'protein_def']
    }
    joblib.dump(feature_info, os.path.join(MODEL_DIR, "feature_info.joblib"))
    
    print(f"\nModel saved to {MODEL_DIR}")
    print("Training completed successfully!")
    
    return model, scaler, history

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Train nutrient deficiency prediction model')
    parser.add_argument("--csv", help="Path to dataset CSV (optional)", default=None)
    parser.add_argument("--epochs", type=int, help="Number of training epochs", default=100)
    args = parser.parse_args()
    
    main(args.csv)
