import mysql.connector
import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

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
    fatContent: float
    saturatedFatContent: float
    cholesterolContent: float
    sodiumContent: float
    carbohydrateContent: float
    fiberContent: float
    sugarContent: float
    proteinContent: float

class Recipe(BaseModel):
    name: str
    prepTime: str  # Stored as TIME in SQL, keep as string
    cookTime: str  # Stored as TIME in SQL, keep as string
    totalTime: str  # Stored as TIME in SQL, keep as string
    recipeCategory: str
    calories: float
    nutrients: Nutrients
    recipeServings: str
    ingredients: List[str]
    recipeInstructions: List[str]

# Router
router = APIRouter()

# Function to get database connection
def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        raise(f"Database connection error: {err}")
        return None

# API Endpoint to Create a Recipe
@router.post("/recipes/")
async def create_recipe(recipe: Recipe):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor()

    try:
        # Insert Recipe
        cursor.execute(
            """
            INSERT INTO user_recipes (Name, CookTime, PrepTime, TotalTime, RecipeCategory, 
                                      Calories, FatContent, SaturatedFatContent, CholesterolContent, 
                                      SodiumContent, CarbohydrateContent, FiberContent, SugarContent, 
                                      ProteinContent, RecipeServings, Ingredients, RecipeInstructions) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                recipe.name, recipe.prepTime, recipe.cookTime, recipe.totalTime,
                recipe.recipeCategory, recipe.calories, recipe.nutrients.fatContent,
                recipe.nutrients.saturatedFatContent, recipe.nutrients.cholesterolContent,
                recipe.nutrients.sodiumContent, recipe.nutrients.carbohydrateContent,
                recipe.nutrients.fiberContent, recipe.nutrients.sugarContent, recipe.nutrients.proteinContent,
                recipe.recipeServings, str(recipe.ingredients), str(recipe.recipeInstructions)
            )
        )
        recipe_id = cursor.lastrowid

        conn.commit()
        return {"success": True, "message": "Recipe added successfully!"}

    except Exception as e:
        conn.rollback()
        return {"success": False, "message": f"Database error: {str(e)}"}

    finally:
        cursor.close()
        conn.close()
