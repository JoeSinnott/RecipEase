import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector as sql
from argon2 import PasswordHasher

# Create a FastAPI router
router = APIRouter()

# Password hasher
ph = PasswordHasher()

# Define request model
class User(BaseModel):
    email: str
    password: str

# Function to connect to the database
def get_db_connection():
    try:
        conn = sql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        print("Connected to database successfully!")
        return conn
    except sql.Error as e:
        print(f"Database connection failed: {str(e)}")
        return None

# Signup route
@router.post("/signup")
async def signup(user: User):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    cursor = conn.cursor()

    # Check if email exists (Use `%s` for MySQL placeholders)
    cursor.execute("SELECT * FROM users WHERE Email = %s", (user.email,))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email already in use.")

    # Hash the password
    hashed_password = ph.hash(user.password)

    # Insert into database
    cursor.execute("INSERT INTO users (Email, PasswordHash) VALUES (%s, %s)", (user.email, hashed_password))
    conn.commit()
    
    cursor.close()
    conn.close()

    return {"message": "Account created successfully!"}