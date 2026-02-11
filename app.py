import os
import requests
from flask_cors import CORS
from flask import Flask, send_from_directory, request, jsonify

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'clips_temp.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/proxy')
def proxy_riot_api():
    summoner_name = request.args.get('name')
    region = "PH1" # Change this if you want other regions
    API_KEY = os.environ.get("RIOT_API_KEY")

    if not API_KEY:
        return jsonify({"error": "Server API Key not configured"}), 500

    url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}"
    headers = {"X-Riot-Token": API_KEY}

    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
