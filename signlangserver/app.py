from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image
import cv2
import mediapipe as mp
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize MediaPipe Hands
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)

# Load your trained model
model = None
try:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "models", "sign_language_model.keras")
    print(f"Attempting to load model from: {model_path}")
    
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully!")
    
    # Print model details for debugging
    print("Model input shape:", model.input_shape)
    print("Model output shape:", model.output_shape)
    model.summary()
    
except Exception as e:
    print(f"Error loading model: {e}")

# Define your gesture classes
gesture_classes = ["A", "B", "C", "D", "E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","10"]

def extract_hand_landmarks(image):
    """Extract hand landmarks from an image using MediaPipe."""
    # Convert PIL Image to cv2 format
    image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Convert to RGB for MediaPipe
    image_rgb = cv2.cvtColor(image_cv, cv2.COLOR_BGR2RGB)
    
    # Process the image
    results = hands.process(image_rgb)
    
    # Extract landmarks
    landmarks = []
    if results.multi_hand_landmarks:
        hand_landmarks = results.multi_hand_landmarks[0]  # Get first hand
        for landmark in hand_landmarks.landmark:
            landmarks.extend([landmark.x, landmark.y, landmark.z])
    else:
        # No hand detected, return zeros
        print("No hand detected in the image")
        landmarks = [0.0] * 63  # 21 landmarks * 3 coordinates
    
    return np.array(landmarks)

def preprocess_image(image_data):
    """Process base64 image data to extract hand landmarks."""
    try:
        # Decode base64 image
        img = Image.open(io.BytesIO(base64.b64decode(image_data.split(',')[1])))
        print(f"Image decoded successfully, size: {img.size}")
        
        # Extract hand landmarks
        landmarks = extract_hand_landmarks(img)
        print(f"Extracted {len(landmarks)} landmark features")
        
        # Reshape to match expected model input
        features = np.reshape(landmarks, (1, 1, 63))
        print(f"Reshaped features to: {features.shape}")
        
        return features
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        import traceback
        traceback.print_exc()
        raise

@app.route('/status', methods=['GET'])
def status():
    """Endpoint to check if the server is running and model is loaded."""
    if model is not None:
        return jsonify({
            "status": "running",
            "model_loaded": True,
            "model_input_shape": str(model.input_shape),
            "classes": gesture_classes
        })
    else:
        return jsonify({
            "status": "running",
            "model_loaded": False,
            "error": "Model not loaded correctly"
        })

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to process images and return predictions."""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
    
    try:
        # Get image data from request
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400
        
        # Preprocess the image
        print("Starting preprocessing...")
        features = preprocess_image(data['image'])
        print(f"Shape of features sent to model: {features.shape}")  # Debugging
        print("Preprocessing completed")
        
        # Make prediction
        print("Making prediction...")
        predictions = model.predict(features)
        print(f"Prediction shape: {predictions.shape}")
        
        # Get the predicted class index and confidence
        class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][class_index])
        
        print(f"Predicted class: {class_index}, confidence: {confidence}")
        
        # Return the results
        return jsonify({
            "class_index": int(class_index),
            "confidence": confidence,
            "gesture": gesture_classes[class_index]
        })
    
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)