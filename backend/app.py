from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models.user import auth_routes
from models.project import project_routes
from models.task import task_routes
import os

app = Flask(__name__)
# CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)
# CORS(app, origins=["http://localhost:5500", "http://127.0.0.1:5500"], supports_credentials=True)

# app.py
CORS(app,
     origins=["http://localhost:5500", "http://127.0.0.1:5500"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"])


app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")

# app.config['JWT_TOKEN_LOCATION'] = ['cookies']
# app.config['JWT_COOKIE_SECURE'] = True
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = False  # Required if testing locally over HTTP

app.config['JWT_COOKIE_SAMESITE'] = "Lax"
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(project_routes, url_prefix="/project")
app.register_blueprint(task_routes, url_prefix="/task")

jwt = JWTManager(app)

@app.route('/')
def home():
    return {"message": "Welcome to the Study Pod API!"}

if __name__ == "__main__":
    # init_db()
    app.run(port=5000, debug=True)