from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import requests

# Get the directory where app.py is located
base_dir = os.path.dirname(os.path.abspath(__file__))

# Initialize Flask
app = Flask(__name__, static_url_path='', static_folder=base_dir)
CORS(app) # Allow your website to talk to the backend

# --- 1. THE MAIN HOME ROUTE ---
# We renamed the file to 'index.html' to fix the 404 error
@app.route('/')
def index():
    return send_from_directory(base_dir, 'Clips.html')

# --- 2. SERVE CSS, JS, AND IMAGES ---
# This generic route finds any file you ask for (Clips.css, Clips.js, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(base_dir, path)

# --- 3. THE RIOT API PROXY ---
@app.route('/api/proxy')
def proxy_riot_api():
    # Get the summoner name and tag from your frontend
    game_name = request.args.get('name')
    tag_line = request.args.get('tag')
    
    # Get your API Key from Render's Environment Variables
    API_KEY = os.environ.get("RIOT_API_KEY")
    
    if not API_KEY:
        print("Error: RIOT_API_KEY is missing!")
        return jsonify({"error": "Server API Key not configured"}), 500

    # Modern Riot API Call (Account-V1) for Riot IDs (Name#Tag)
    # Using 'sea' region for Philippines/SE-Asia
    regional_host = "sea.api.riotgames.com" 
    url = f"https://{regional_host}/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
    headers = {"X-Riot-Token": API_KEY}
    
    response = requests.get(url, headers=headers)
    
    # Return whatever Riot sends back
    return jsonify(response.json()), response.status_code

# --- 4. START THE SERVER ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
