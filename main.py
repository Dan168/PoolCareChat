from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

OPENAI_API_KEY = 'API KEY'  # Replace with your actual API key


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        "model": "gpt-4",  # Ensure you're using the correct model
        "messages": [
            {"role": "system", "content": "You are a pool engineer. You only answer questions regarding pools."},
            {"role": "user", "content": user_message}
        ]
    }
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    response_data = response.json()
    bot_message = response_data['choices'][0]['message']['content']

    # Format bot message with HTML
    formatted_message = format_message(bot_message)

    return jsonify(formatted_message)


def format_message(message):
    # Replace simple markdown-like syntax with HTML tags
    formatted_message = message.replace('\n', '<br>')

    # Example of handling bullet points and bold text
    formatted_message = formatted_message.replace('**', '<b>').replace('**', '</b>')
    formatted_message = formatted_message.replace('* ', '<li>').replace('\n', '</li>')

    return formatted_message


if __name__ == '__main__':
    app.run(debug=True, port=6001)
