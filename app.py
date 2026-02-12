from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import requests

base_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_url_path='', static_folder=base_dir)
CORS(app) 

# 2. HOME ROUTE
@app.route('/')
def index():
    return send_from_directory(base_dir, 'main.html')

# 3. STATIC FILES (CSS/JS)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(base_dir, path)

# 4. API PROXY
@app.route('/api/proxy')
def proxy_riot_api():
    game_name = request.args.get('name')
    tag_line = request.args.get('tag')
    API_KEY = os.environ.get("RIOT_API_KEY")
    
    if not API_KEY:
        return jsonify({"error": "No API Key found"}), 500

    regional_host = "sea.api.riotgames.com"
    url = f"https://{regional_host}/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
    headers = {"X-Riot-Token": API_KEY}
    
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port)
