import mysql.connector as sql
import os

def get_db_connection():
    """Establish and return a MySQL database connection."""
    try:
        conn = sql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return conn
    except sql.Error as e:
        print(f"Database connection failed: {str(e)}")
        return None
