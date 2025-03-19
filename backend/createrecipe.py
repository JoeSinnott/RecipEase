import mysql.connector
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import re

# Load environment variables
load_dotenv()

# Database Configuration
db_config = {
    "host": os.getenv("DB_HOST", "dbhost.cs.man.ac.uk"),
    "user": os.getenv("DB_USER", "y46354js"),
    "password": os.getenv("DB_PASSWORD", "G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs"),
    "database": os.getenv("DB_NAME", "2024_comp10120_cm5"),
}

# Define Pydantic Models
class Nutrients(BaseModel):
    saturatedFat: str
    cholesterol: str
    sodium: str
    carbohydrate: str
    fiber: str
    sugar: str
    protein: str

class Recipe(BaseModel):
    name: str
    category: str
    prepTime: str
    cookTime: str
    totalTime: str
    calories: str
    servings: str
    nutrients: Nutrients
    ingredients: List[str]
    instructions: List[str]

# Router
router = APIRouter()

# Function to get database connection
def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        print("Database connection error:", err)
        return None

# Function to convert time string (e.g., "1h 30m") to MySQL TIME format (HH:MM:SS)
def convert_time_to_mysql_format(time_str):
    hours = 0
    minutes = 0
    
    # Extract hours
    hour_match = re.search(r'(\d+)h', time_str)
    if hour_match:
        hours = int(hour_match.group(1))
    
    # Extract minutes
    min_match = re.search(r'(\d+)m', time_str)
    if min_match:
        minutes = int(min_match.group(1))
    
    # Format as MySQL TIME
    return f"{hours:02d}:{minutes:02d}:00"

# API Endpoint to Create a Recipe
@router.post("/api/recipes")
async def create_recipe(recipe: Recipe):
    print(f"Received recipe: {recipe}")
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor()

    try:
        # Convert time strings to MySQL TIME format
        mysql_prep_time = convert_time_to_mysql_format(recipe.prepTime)
        mysql_cook_time = convert_time_to_mysql_format(recipe.cookTime)
        mysql_total_time = convert_time_to_mysql_format(recipe.totalTime) if "h" in recipe.totalTime or "m" in recipe.totalTime else recipe.totalTime
        
        print(f"Converted times: Prep={mysql_prep_time}, Cook={mysql_cook_time}, Total={mysql_total_time}")
        
        # Insert Recipe into user_recipes table
        cursor.execute(
            """
            INSERT INTO user_recipes (Name, CookTime, PrepTime, TotalTime, RecipeCategory, 
                                    Calories, SaturatedFatContent, CholesterolContent, 
                                    SodiumContent, CarbohydrateContent, FiberContent, 
                                    SugarContent, ProteinContent, RecipeServings, 
                                    Ingredients, RecipeInstructions) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                recipe.name, mysql_cook_time, mysql_prep_time, mysql_total_time,
                recipe.category, recipe.calories, recipe.nutrients.saturatedFat,
                recipe.nutrients.cholesterol, recipe.nutrients.sodium,
                recipe.nutrients.carbohydrate, recipe.nutrients.fiber,
                recipe.nutrients.sugar, recipe.nutrients.protein,
                recipe.servings, str(recipe.ingredients), str(recipe.instructions)
            )
        )
        recipe_id = cursor.lastrowid
        print(f"Recipe added with ID: {recipe_id}")

        conn.commit()
        return {"message": "Recipe added successfully!", "recipe_id": recipe_id}

    except Exception as e:
        conn.rollback()
        print(f"Error creating recipe: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        cursor.close()
        conn.close()
