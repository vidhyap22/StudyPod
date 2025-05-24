import sqlite3
from flask import Flask, request, jsonify, Blueprint, make_response
from models.user import token_required 

task_routes = Blueprint("task_routes", __name__)

def create_project_table():
    """This is creating the whole table where all the projects will go."""
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()

    cur.execute("""CREATE TABLE Task (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_name TEXT,
        user_id INTEGER,
        project_id INTEGER,
        is_completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (project_id) REFERENCES Project(project_id)
    )
    """)

    conn.commit()
    conn.close()

# create_project_table()


@task_routes.route('/create-task', methods=['POST'])
@token_required
def create_task(current_user):

    data = request.json

    try:
        conn = sqlite3.connect("gus.db")
        cur = conn.cursor()

        cur.execute("""INSERT INTO Task (task_name, user_id, project_id, is_completed) 
                    VALUES (?, ?, ?, ?)""", 
                    (data["task_name"], data["user_id"], data["project_id"], data["is_completed"]))
        conn.commit()

        return jsonify(msg="Created task!"), 201
    except sqlite3.IntegrityError as e:
        return jsonify(msg=f"Error creating task: {str(e)}"), 500
    finally:
        conn.close()


