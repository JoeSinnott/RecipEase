from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector as sql
import bcrypt

app = FastAPI()

# Define request model
class User(BaseModel):
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


@app.post("/signup")
async def signup(user: User):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if email exists
    cursor.execute("SELECT * FROM users WHERE Email = ?", (user.email,))
    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already in use.")

    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())

    # Insert into database
    cursor.execute("INSERT INTO users (Email, PasswordHash) VALUES (?, ?)", (user.email, hashed_password))
    conn.commit()
    conn.close()

    return {"message": "Account created successfully!"}