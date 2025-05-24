import sqlite3
from flask import Flask, request, jsonify, Blueprint, make_response
from user import token_required 

project_routes = Blueprint("project_routes", __name__)

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


# @project_routes.route('/create-a-project', methods=['POST'])
# def login(current_user, project_id):


create_project_table()
