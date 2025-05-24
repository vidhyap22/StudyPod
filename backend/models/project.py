import sqlite3
from flask import Flask, request, jsonify, Blueprint, make_response
from models.user import token_required 

project_routes = Blueprint("project_routes", __name__)


@project_routes.route('/get-all-projects', methods=['GET'])
@token_required
def get_all_projects(current_user):
    """This returns all the ACTIVE projects associated with a given user id."""
    print("debug current user: ", current_user)
    user_id = current_user[0]
    
    conn = sqlite3.connect("gus.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT p.*
        FROM Project p
        JOIN User_Project up ON p.project_id = up.project_id
        WHERE up.user_id = ? AND p.is_active = 1
    """, (user_id,))

    rows = cur.fetchall()
    conn.close()

    if rows:
        project_list = [dict(row) for row in rows]
        return jsonify(project_list), 200
    else:
        return jsonify([]), 200  # No projects yet — return empty list


@project_routes.route('/get-project', methods=['GET'])
@token_required
def get_project(current_user): # current user is the entire tuple
    """This returns one project given the project id. Does not use user id."""
    # print("current user: ", current_user)
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



@project_routes.route('/create-project', methods=['POST'])
@token_required
def create_project(current_user):

    data = request.json
    user_ids = data["user_ids"]

    try:
        conn = sqlite3.connect("gus.db")
        cur = conn.cursor()

        cur.execute("""INSERT INTO Project (project_title, gus_name, level, deadline, is_active, created_time) 
                    VALUES (?, ?, ?, ?, ?, ?)""", 
                    (data["project_title"], data["gus_name"], data["level"], data["deadline"], data["is_active"], datetime.now()))
        project_id = cur.lastrowid

        user_project_pairs = [(uid, project_id) for uid in user_ids]
        
        cur.executemany("INSERT INTO User_Project (user_id, project_id) VALUES (?, ?)", user_project_pairs)
        conn.commit()

        return jsonify(msg="Created project!"), 201
    except sqlite3.IntegrityError as e:
        return jsonify(msg=f"Error creating project: {str(e)}"), 500
    finally:
        conn.close()

create_project_table()



# create_project_table()
# conn = sqlite3.connect("gus.db")
# cur = conn.cursor()

# cur.execute("""INSERT INTO Project (gus_name, project_title, level, deadline, is_active) VALUES ('dead', 'old project', 50, '2025-06-01', 0);""")
# cur.execute("""INSERT INTO User_Project (user_id, project_id) VALUES (1, 3);""")

# conn.commit()
# conn.close()