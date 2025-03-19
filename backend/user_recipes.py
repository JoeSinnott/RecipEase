import mysql.connector
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

# Load environment variables
load_dotenv()

# Database Configuration
db_config = {
    "host": os.getenv("DB_HOST", "dbhost.cs.man.ac.uk"),
    "user": os.getenv("DB_USER", "y46354js"),
    "password": os.getenv("DB_PASSWORD", "G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs"),
    "database": os.getenv("DB_NAME", "2024_comp10120_cm5"),
}

# Router
router = APIRouter()

# Function to get database connection
def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        return None

# API Endpoint to Get User Recipes
@router.get("/api/user-recipes")
async def get_user_recipes(page: int = Query(1, ge=1), per_page: int = Query(12, ge=1, le=50)):
    print(f"Fetching user recipes for page {page}, per_page {per_page}")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor(dictionary=True)

    try:
        # Calculate offset for pagination
        offset = (page - 1) * per_page

        # Get total count of recipes
        cursor.execute("SELECT COUNT(*) as total FROM user_recipes")
        total_result = cursor.fetchone()
        total_recipes = total_result["total"] if total_result else 0
        print(f"Total user recipes: {total_recipes}")

        # Get paginated recipes
        cursor.execute(
            """
            SELECT RecipeId, Name, RecipeCategory, PrepTime, CookTime, TotalTime, 
                   Calories, RecipeServings, Ingredients, RecipeInstructions 
            FROM user_recipes 
            ORDER BY RecipeId DESC 
            LIMIT %s OFFSET %s
            """,
            (per_page, offset)
        )
        
        recipes = cursor.fetchall()
        print(f"Found {len(recipes)} recipes for current page")

        # Process recipes to convert string lists back to actual lists
        for recipe in recipes:
            if recipe.get("Ingredients") and isinstance(recipe["Ingredients"], str):
                try:
                    recipe["Ingredients"] = eval(recipe["Ingredients"])
                except:
                    recipe["Ingredients"] = []
                    
            if recipe.get("RecipeInstructions") and isinstance(recipe["RecipeInstructions"], str):
                try:
                    recipe["RecipeInstructions"] = eval(recipe["RecipeInstructions"])
                except:
                    recipe["RecipeInstructions"] = []

        return {
            "recipes": recipes,
            "total_recipes": total_recipes,
            "page": page,
            "per_page": per_page,
            "total_pages": (total_recipes + per_page - 1) // per_page
        }

    except Exception as e:
        print(f"Error fetching user recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        cursor.close()
        conn.close() 