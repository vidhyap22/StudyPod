from flask import Flask

app = Flask(__name__)

app.register_blueprint(auth_routes, url_prefix="/auth")

@app.route('/')
def home():
    return {"message": "Welcome to the Study Pod API!"}

if __name__ == '__main__':
    app.run(debug=True)