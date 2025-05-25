from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models.user import auth_routes
from models.project import project_routes
from models.task import task_routes
import os

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500"], supports_credentials=True)


app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(project_routes, url_prefix="/project")
app.register_blueprint(task_routes, url_prefix="/task")

app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = True

jwt = JWTManager(app)

@app.route('/')
def home():
    return {"message": "Welcome to the Study Pod API!"}

if __name__ == "__main__":
    # init_db()
    app.run(port=5000, debug=True)