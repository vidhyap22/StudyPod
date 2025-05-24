import sqlite3
from flask import Flask, request, jsonify, Blueprint, make_response
from models.user import token_required 

project_routes = Blueprint("project_routes", __name__)


@project_routes.route('/get-project', methods=['GET'])
@token_required
def get_project(current_user): # current user is the entire tuple
    print("current user: ", current_user)
    project_id = request.args.get("project_id")

    if not project_id:
        return jsonify({"message": "Missing project_id"}), 400
    
    conn = sqlite3.connect("gus.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM Project WHERE project_id = ? """, (project_id))
    
    row = cur.fetchone()
    conn.close()

    if row:
        return jsonify(dict(row)), 200
    else:
        return jsonify({"message": "Project not found or access denied"}), 404

def create_project_table():
    """This is creating the whole table where all the projects will go."""
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS Project (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        gus_name TEXT NOT NULL,
        project_title TEXT NOT NULL,
        level INTEGER CHECK(level BETWEEN 0 AND 100) DEFAULT 0,
        deadline DATE,
        is_active BOOLEAN DEFAULT 1,
        created_time DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()



# create_project_table()
