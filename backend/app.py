from flask import Flask
from models.user import auth_routes
from models.project import project_routes
from models.task import task_routes

app = Flask(__name__)

app.register_blueprint(auth_routes, url_prefix="/auth")
app.register_blueprint(project_routes, url_prefix="/project")
app.register_blueprint(task_routes, url_prefix="/task")

@app.route('/')
def home():
    return {"message": "Welcome to the Study Pod API!"}

if __name__ == '__main__':
    app.run(debug=True)