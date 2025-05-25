import sqlite3
from flask import Flask, request, jsonify, Blueprint, make_response
from models.user import token_required 
from datetime import datetime

project_routes = Blueprint("project_routes", __name__)

@project_routes.route('/create-project', methods=['POST'])
@token_required
def create_project(current_user):
    my_user_id = current_user[0]
    data = request.json
    usernames = data.get("usernames", [])
    print("debug, usernames of teammates: ", usernames)
    try:
        conn = sqlite3.connect("gus.db")
        cur = conn.cursor()

        user_ids = [my_user_id]
        for username in usernames:
            cur.execute("SELECT user_id FROM User WHERE username = ?", (username,))
            row = cur.fetchone()
            if row:
                user_ids.append(row[0])
            else:
                return jsonify(msg=f"User '{username}' not found."), 404

        # insert into project table
        cur.execute("""INSERT INTO Project (project_title, gus_name, level, deadline, is_active, created_time) 
                    VALUES (?, ?, ?, ?, ?, ?)""", 
                    (data["project_title"], data["gus_name"], data["level"], data["deadline"], data["is_active"], datetime.now()))
        project_id = cur.lastrowid

        # associate users with the project
        user_project_pairs = [(uid, project_id) for uid in user_ids]
        cur.executemany("INSERT INTO User_Project (user_id, project_id) VALUES (?, ?)", user_project_pairs)
        conn.commit()

        return jsonify({
            "msg":"Created project!",
            "project_id":project_id}
            ), 201
    except sqlite3.IntegrityError as e:
        return jsonify(msg=f"Error creating project: {str(e)}"), 500
    finally:
        conn.close()


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
    print("debug project_id: ", project_id)
    if not project_id:
        return jsonify({"message": "Missing project_id"}), 400
    
    conn = sqlite3.connect("gus.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT * FROM Project WHERE project_id = ? """, (project_id,))
    
    row = cur.fetchone()
    conn.close()

    if row:
        return jsonify(dict(row)), 200
    else:
        return jsonify({"message": "Project not found or access denied"}), 404


@project_routes.route('/get-project-owners', methods=['GET'])
@token_required
def get_project_owners(current_user):
    """This returns all the owners of the project given the project id."""
    project_id = request.args.get('project_id')

    if not project_id:
        return jsonify({'error': 'Missing project_id'}), 400

    conn = sqlite3.connect("gus.db")
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.execute("""
        SELECT u.user_id, u.username
        FROM User u
        JOIN User_Project up ON u.user_id = up.user_id
        WHERE up.project_id = ?
    """, (project_id,))

    owners = [dict(row) for row in cur.fetchall()]
    conn.close()

    return jsonify(owners), 200

@project_routes.route('/update-gus-level', methods=['PUT'])
@token_required
def update_gus_level(current_user):

    data = request.json

    try:
        conn = sqlite3.connect("gus.db")
        cur = conn.cursor()

        cur.execute(f"""UPDATE Project
                        SET level = {data["level"]}
                        WHERE project_id = {data["project_id"]};""")
        conn.commit()

        return jsonify(msg="Updated Gus Level!"), 201
    except sqlite3.IntegrityError as e:
        return jsonify(msg=f"Error updating level: {str(e)}"), 500
    finally:
        conn.close()
# ---------------------------------------------------------------------------

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

    project_id = cur.lastrowid

# create_project_table()
# conn = sqlite3.connect("gus.db")
# cur = conn.cursor()

# # cur.execute("""INSERT INTO Project (gus_name, project_title, level, deadline, is_active) VALUES ('dead', 'old project', 50, '2025-06-01', 0);""")
# cur.execute("""INSERT INTO User_Project (user_id, project_id) VALUES (3, 3);""")

# conn.commit()
# conn.close()