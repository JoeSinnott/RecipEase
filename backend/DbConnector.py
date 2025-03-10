import mysql.connector as sql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db_connection():
    """Establish and return a MySQL database connection."""
    try:
        conn = sql.connect(
            host=os.getenv("DB_HOST", "dbhost.cs.man.ac.uk"),  # ✅ University database host
            user=os.getenv("DB_USER", "y46354js"),
            password=os.getenv("DB_PASSWORD", "G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs"),
            database=os.getenv("DB_NAME", "2024_comp10120_cm5"),
            port=int(os.getenv("DB_PORT", 3306))  # ✅ Ensure correct port
        )

        print("✅ Connected to University Database!")
        return conn
    except sql.Error as e:
        print(f"❌ Database connection failed: {str(e)}")
        return None
