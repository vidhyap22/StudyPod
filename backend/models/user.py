import sqlite3
import bcrypt
import datetime
from flask import Flask, request, jsonify, Blueprint, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt
from dotenv import load_dotenv
import os

load_dotenv()



auth_routes = Blueprint("auth_routes", __name__)

def hash_password(plain_password):
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(plain_password, hashed):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed.encode('utf-8'))


def authenticate_user(un, pwd):
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM User WHERE username = '{un}'")
    user = cur.fetchone()

    if not user or not check_password(pwd, user["password"]):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    token = jwt.encode({'user_id': user.user_id, 'exp': datetime.now()}, os.getenv("SECRET_KEY"), algorithm="HS256")

    # response = make_response(redirect(url_for('dashboard')))
    response = make_response(jsonify({"message": "Login succesful!"}))
    response.set_cookie('jwt_token', token)

    return response



@auth_routes.route('/register', methods=['POST'])
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


@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data["username"]
    password = hash_password(data["password"])

    response = authenticate_user(username, password)



def init_db():
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()