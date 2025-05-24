import sqlite3
import bcrypt
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token

auth_routes = Blueprint("auth_routes", __name__)

@auth_routes.route('/register', methods='POST')
def register():
    data = request.json
    username = data["username"]
    password = hash_password(data["password"])

    try:
        conn = sqlite3.connect("gus.db")
        cur = conn.cursor()
        cur.execute("INSERT INTO User (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return jsonify(msg="User registered!"), 201
    except sqlite3.IntegrityError:
        return jsonify(msg="Username already exists."), 400
    finally:
        conn.close()

# def init_db():
#     conn = sqlite3.connect("gus.db")
#     cur = conn.cursor()

#     cur.execute("""
#     CREATE TABLE IF NOT EXISTS User (
#         user_id INTEGER PRIMARY KEY AUTOINCREMENT,
#         username TEXT NOT NULL UNIQUE,
#         password TEXT NOT NULL
#     );
#     """)

#     conn.commit()
#     conn.close()

# init_db()

def hash_password(plain_password):
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(plain_password, hashed):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed.encode('utf-8'))

