import sqlite3
import bcrypt
from datetime import datetime, timedelta, timezone
from flask import Flask, request, jsonify, Blueprint, make_response
from flask_jwt_extended import JWTManager, create_access_token
import jwt

from dotenv import load_dotenv
from functools import wraps
import os

load_dotenv()



auth_routes = Blueprint("auth_routes", __name__)

def hash_password(plain_password):
    return bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(plain_password, hashed):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed.encode('utf-8'))

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('jwt_token')
        print("in token_required: ", token)
        if not token:
            return jsonify({'message': 'Missing Token'}), 401

        try:
            print("secret_key: ", os.getenv("SECRET_KEY"))
            data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])

            conn = sqlite3.connect("gus.db")
            cur = conn.cursor()
            cur.execute(f"SELECT * FROM User WHERE user_id = '{data['user_id']}'")
            user = cur.fetchone()
        except Exception as e:
            print("e: ", e)
            return jsonify({'message': 'Invalid Token'}), 401

        return f(user, *args, **kwargs)

    return decorated

def authenticate_user(un, plain_pwd):
    conn = sqlite3.connect("gus.db")
    cur = conn.cursor()
    cur.execute("SELECT * FROM User WHERE username = ?", (un,))
    user = cur.fetchone()

    print(user)
    print("inputting password: ", plain_pwd)
    # print("hashed password: ", hash_password(plain_pwd))
    print("fetched password: ", user[2])

    if not user or not check_password(plain_pwd, user[2]):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    token = jwt.encode({'user_id': user[0], 'exp': datetime.now(timezone.utc) + timedelta(hours=1)}, os.getenv("SECRET_KEY"), algorithm="HS256")

    # response = make_response(redirect(url_for('dashboard')))
    response = make_response(jsonify({"message": "Login succesful!"}))
    # response.set_cookie('jwt_token', token)
    response.set_cookie('jwt_token', token, httponly=True, samesite='Lax', path='/')


    return response



@auth_routes.route('/register', methods=['POST'])
def register():
    print("debug reached register")
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
    print("debug: login attempted")
    data = request.json
    username = data["username"]
    password = data["password"]

    response = authenticate_user(username, password)
    return response


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