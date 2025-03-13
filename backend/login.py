import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector as sql
from argon2 import PasswordHasher

# Create a FastAPI router
router = APIRouter()

# Password hasher
ph = PasswordHasher()

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

# Login route
@router.post("/login")
async def login(user: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    cursor = conn.cursor(dictionary=True)  # Use dictionary=True to get column names
    
    # Fetch user by email (Use `%s` for MySQL placeholders)
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

    cursor.close()
    conn.close()

    return {"message": "Login successful!"}
