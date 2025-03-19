import os
import jwt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector as sql
from argon2 import PasswordHasher
from datetime import datetime, timedelta

# Create a FastAPI router
router = APIRouter()

# Password hasher
ph = PasswordHasher()

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-here")  # Replace with a strong secret in production
ALGORITHM = "HS256"  # JWT algorithm
TOKEN_EXPIRY_MINUTES = 5  # Token expiration time

# Request model for login
class LoginRequest(BaseModel):
    email: str
    password: str

# Function to connect to the database
def get_db_connection():
    """Establish and return a MySQL database connection."""
    try:
        conn = sql.connect(
            host=os.getenv("DB_HOST", "dbhost.cs.man.ac.uk"),
            user=os.getenv("DB_USER", "y46354js"),
            password=os.getenv("DB_PASSWORD", "G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs"),
            database=os.getenv("DB_NAME", "2024_comp10120_cm5")
        )
        print("Connected to database successfully!")
        return conn
    except sql.Error as e:
        print(f"Database connection failed: {str(e)}")
        return None

# Function to generate a JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRY_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Login route
@router.post("/login")
async def login(user: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    cursor = conn.cursor(dictionary=True)  # Use dictionary=True to get column names
    
    # Fetch user by email
    cursor.execute("SELECT * FROM users WHERE Email = %s", (user.email,))
    db_user = cursor.fetchone()

    if not db_user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    # Check password
    stored_password = db_user["PasswordHash"]  # Stored hashed password
    try:
        if not ph.verify(stored_password, user.password):
            raise HTTPException(status_code=400, detail="Invalid email or password.")
    except:
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    # Generate token
    token_payload = {
        "sub": db_user["Email"],  # Subject (typically user ID or email)
        "user_id": db_user["UserId"] 
    }
    access_token = create_access_token(data=token_payload, expires_delta=timedelta(minutes=TOKEN_EXPIRY_MINUTES))

    user_data = {
        "username": db_user["Username"],
        "email": db_user["Email"],
        "user_id": db_user["UserId"]
        # Add other fields as needed, e.g., "username": db_user["Username"]
    }

    cursor.close()
    conn.close()

    return {
        "message": "Login successful!",
        "token": access_token,
        "user": user_data
    }
