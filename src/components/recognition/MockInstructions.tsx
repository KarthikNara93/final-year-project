
interface MockInstructionsProps {
  usingMockData: boolean;
}

const MockInstructions = ({ usingMockData }: MockInstructionsProps) => {
  if (!usingMockData) return null;

  return (
    <div className="mt-4 p-4 border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
      <h3 className="font-semibold mb-2">Using Mock Data - API Issues Detected</h3>
      <p className="text-sm mb-2">To fix your model loading issue:</p>
      <ol className="text-sm list-decimal pl-5 space-y-1">
        <li>Check your Flask server endpoint responses - they should match the expected formats</li>
        <li>Ensure your <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">/status</code> endpoint returns: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{`{"status": "running", "model_loaded": true, "classes": ["A", "B", ...]}`}</code></li>
        <li>Make sure CORS is enabled on your Flask server by adding this code to your Flask application:</li>
        <div className="bg-gray-100 dark:bg-gray-800 text-xs p-2 rounded my-2 overflow-x-auto">
          <pre>{`# Complete basic Flask application with CORS enabled
from flask import Flask, jsonify, request
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Your model loading code here
# model = ...

@app.route('/status', methods=['GET'])
def status():
    try:
        # Check if model is loaded
        if model is not None:
            return jsonify({
                'status': 'running',
                'model_loaded': True,
                'classes': ['A', 'B', 'C', 'D']  # Your actual classes
            })
        else:
            return jsonify({
                'status': 'running', 
                'model_loaded': False,
                'error': 'Model not loaded'
            })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'model_loaded': False,
            'error': str(e),
            'details': traceback.format_exc()
        })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get image data from request
        data = request.json
        image_data = data['image']
        
        # Process image and make prediction
        # prediction = model.predict(processed_image)
        
        # Return prediction result
        return jsonify({
            'class_index': 0,  # Replace with actual prediction
            'confidence': 0.95  # Replace with actual confidence
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'details': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
`}</pre>
        </div>
        <li>Install flask-cors if needed: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">pip install flask-cors</code></li>
        <li>Verify that the prediction endpoint correctly processes and returns the expected format</li>
      </ol>
      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <p className="text-xs font-medium">Model Loading Troubleshooting:</p>
        <ul className="text-xs list-disc pl-4 mt-1">
          <li>Check your Flask routes: make sure they return valid JSON responses</li>
          <li>Try manually calling your API endpoints with tools like Postman or curl</li>
          <li>Look for error messages in your Flask server console</li>
          <li>Add more detailed error logging in your Flask app</li>
          <li>Ensure your Flask server is running on <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">http://127.0.0.1:5000</code> or update the API_URL in recognitionService.ts</li>
          <li>Restart both your Flask server and your React application after making changes</li>
        </ul>
      </div>
    </div>
  );
};

export default MockInstructions;