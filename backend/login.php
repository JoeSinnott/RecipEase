rom fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import mysql.connector as sql
import bcrypt

app = FastAPI()

# Request model for login
class LoginRequest(BaseModel):
    email: str
    password: str

# Connect to database (replace with MySQL if needed)
def get_db_connection():
    """Establish and return a MySQL database connection."""
    try:
        conn = sql.connect(
            host=os.getenv("DB_HOST", "dbhost.cs.man.ac.uk"),
            user=os.getenv("DB_USER", "y46354js"),
            password=os.getenv("DB_PASSWORD", "G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs"),
            database=os.getenv("DB_NAME", "2024_comp10120_cm5")
        )
        return conn
    except sql.Error as e:
        print(f"Database connection failed: {str(e)}")
        return None

@app.post("/login")
async def login(user: LoginRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch user by email
    cursor.execute("SELECT * FROM users WHERE Email = ?", (user.email,))
    db_user = cursor.fetchone()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    # Check password
    stored_password = db_user["PasswordHash"]  # Stored hashed password
    if not bcrypt.checkpw(user.password.encode(), stored_password.encode()):
        raise HTTPException(status_code=400, detail="Invalid email or password.")

    # If login successful
    return {"message": "Login successful!"}