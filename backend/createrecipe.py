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
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
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
    recipeName: str
    prepTime: str
    cookTime: str
    totalTime: str
    recipeCategory: str
    calories: str
    recipeServings: str
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

# API Endpoint to Create a Recipe
@router.post("/recipes/")
async def create_recipe(recipe: Recipe):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor()

    try:
        # Insert Recipe
        cursor.execute("""
            INSERT INTO recipes (name, prep_time, cook_time, total_time, category, calories, servings) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (recipe.recipeName, recipe.prepTime, recipe.cookTime, recipe.totalTime, 
              recipe.recipeCategory, recipe.calories, recipe.recipeServings))
        recipe_id = cursor.lastrowid

        # Insert Nutrients
        cursor.execute("""
            INSERT INTO nutrients (recipe_id, saturated_fat, cholesterol, sodium, carbohydrate, fiber, sugar, protein) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (recipe_id, recipe.nutrients.saturatedFat, recipe.nutrients.cholesterol, 
              recipe.nutrients.sodium, recipe.nutrients.carbohydrate, recipe.nutrients.fiber, 
              recipe.nutrients.sugar, recipe.nutrients.protein))

        # Insert Ingredients
        for ingredient in recipe.ingredients:
            cursor.execute("INSERT INTO ingredients (recipe_id, ingredient) VALUES (%s, %s)", (recipe_id, ingredient))

        # Insert Instructions
        for step, instruction in enumerate(recipe.instructions, start=1):
            cursor.execute("INSERT INTO instructions (recipe_id, step_number, instruction) VALUES (%s, %s, %s)", 
                           (recipe_id, step, instruction))

        conn.commit()
        return {"message": "Recipe added successfully!", "recipe_id": recipe_id}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        cursor.close()
        conn.close()
