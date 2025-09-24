# Filename: api/analyze.py
from flask import Flask, request, jsonify
from flask_cors import CORS

# Vercel will detect this 'app' object and use it to handle requests.
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Your model loading logic would go here.
# For a serverless environment, you might load it once globally.
# For now, we will mock the output.
# NOTE: Large models might exceed Vercel's limits on the Hobby plan.

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data.get('text')

        # --- REPLACE THIS WITH YOUR ACTUAL MODEL'S PREDICTION ---
        # This is a placeholder for your NLP model's output.
        mock_emotions = {
            "joy": 0.85,
            "sadness": 0.05,
            "anger": 0.02,
            "surprise": 0.08,
            "fear": 0.01
        }
        # -----------------------------------------------------------

        return jsonify({"emotions": mock_emotions})

    except Exception as e:
        # Log the error for debugging
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500