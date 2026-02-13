from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import requests
from urllib.parse import quote # Added for safe URLs

base_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_url_path='', static_folder=base_dir)
CORS(app) # Configure specific origins for production later!

# 2. HOME ROUTE
@app.route('/')
def index():
    return send_from_directory(base_dir, 'main.html')

# 3. SECURE STATIC FILES
@app.route('/<path:path>')
def serve_static(path):
    # Security: Block access to backend code and secrets
    if path.endswith('.py') or '.env' in path or 'venv' in path:
        return jsonify({"error": "Forbidden"}), 403
    try:
        return send_from_directory(base_dir, path)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

# 4. API PROXY (With Error Handling)
@app.route('/api/proxy')
def proxy_riot_api():
    game_name = request.args.get('name')
    tag_line = request.args.get('tag')
    API_KEY = os.environ.get("RIOT_API_KEY")
    
    if not API_KEY:
        print("CRITICAL: RIOT_API_KEY is missing from environment!")
        return jsonify({"error": "Server configuration error"}), 500

    if not game_name or not tag_line:
        return jsonify({"error": "Missing name or tag"}), 400

    # Safety: Encode the name (handles spaces and special chars)
    safe_name = quote(game_name)
    safe_tag = quote(tag_line)
    
    regional_host = "sea.api.riotgames.com"
    url = f"https://{regional_host}/riot/account/v1/accounts/by-riot-id/{safe_name}/{safe_tag}"
    headers = {"X-Riot-Token": API_KEY}
    
    try:
        response = requests.get(url, headers=headers)
        # Forward the exact status code from Riot (200, 404, 403, etc.)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": "Failed to connect to Riot API"}), 502

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True) # debug=True is okay for localhost only