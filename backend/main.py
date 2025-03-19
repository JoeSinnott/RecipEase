from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from signup import router as signup_router
from login import router as login_router
from createrecipe import router as createrecipe_router
import mysql.connector as sql
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the signup/login routes
app.include_router(signup_router)
app.include_router(login_router)

# Include the createrecipe route
app.include_router(createrecipe_router)

# ✅ Manually Handle OPTIONS Request for CORS Preflight
@app.options("/recipes/suggest")
async def options_handler():
    return JSONResponse(status_code=200, headers={
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    })

# ✅ Database connection function
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

# Request model for recipe suggestions
class RecipeRequest(BaseModel):
    ingredients: List[str]
    page: int = 1
    per_page: int = 12

# Root endpoint (Test if API is running)
@app.get("/")
def read_root():
    return {"message": "API is working!"}

# API to suggest recipes based on ingredients
@app.post("/recipes/suggest")
def suggest_recipes(request: RecipeRequest):
    """Fetches recipes that contain the provided ingredients."""
    print(f"🔍 Received ingredients: {request.ingredients}")  # Debugging

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = conn.cursor(dictionary=True)

    try:
        if not request.ingredients:
            raise HTTPException(status_code=400, detail="No ingredients provided.")

        # First, get total count of matching recipes
        count_query = f"""
            SELECT COUNT(DISTINCT r.RecipeId) as total
            FROM recipes r
            JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId
            JOIN ingredients i ON ri.IngredientId = i.IngredientId
            WHERE i.Name IN ({','.join(['%s'] * len(request.ingredients))})
        """
        cursor.execute(count_query, tuple(request.ingredients))
        total_recipes = cursor.fetchone()['total']

        # Calculate offset for pagination
        offset = (request.page - 1) * request.per_page

        # Main query with pagination
        format_strings = ','.join(['%s'] * len(request.ingredients))
        query = f"""
            SELECT DISTINCT r.RecipeId, r.Name, r.RecipeInstructions, r.Ingredients, 
                   r.CookTime, r.PrepTime, r.TotalTime, r.RecipeCategory, 
                   r.Images, r.AggregatedRating, r.Calories
            FROM recipes r
            JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId
            JOIN ingredients i ON ri.IngredientId = i.IngredientId
            WHERE i.Name IN ({format_strings})
            GROUP BY r.RecipeId
            ORDER BY COUNT(r.RecipeId) DESC
            LIMIT %s OFFSET %s;
        """
        cursor.execute(query, tuple(request.ingredients) + (request.per_page, offset))
        recipes = cursor.fetchall()

        if not recipes:
            print("⚠️ No recipes found for the given ingredients.")
            return {"suggested_recipes": [], "total_recipes": 0}

        # Process the recipes before returning
        processed_recipes = []
        for recipe in recipes:
            processed_recipe = {
                "id": recipe.pop("RecipeId", None),
                "name": recipe.pop("Name", "Unnamed Recipe"),
                "category": recipe.pop("RecipeCategory", "N/A"),
                "prep_time": recipe.pop("PrepTime", "N/A"),
                "cook_time": recipe.pop("CookTime", "N/A"),
                "total_time": recipe.pop("TotalTime", "N/A"),
                "rating": recipe.pop("AggregatedRating", "N/A"),
                "calories": recipe.pop("Calories", "N/A"),
                "images": recipe.pop("Images", "/placeholder.jpg"),
                "ingredients": recipe.pop("Ingredients", "No ingredients listed"),
            }

            if recipe.get("RecipeInstructions"):
                try:
                    if isinstance(recipe["RecipeInstructions"], str):
                        recipe["RecipeInstructions"] = json.loads(recipe["RecipeInstructions"])
                except json.JSONDecodeError:
                    recipe["RecipeInstructions"] = [step.strip() for step in recipe["RecipeInstructions"].split('.') if step.strip()]
            else:
                recipe["RecipeInstructions"] = ["No instructions available."]
            
            processed_recipe["instructions"] = recipe["RecipeInstructions"]
            processed_recipes.append(processed_recipe)

        return {
            "suggested_recipes": processed_recipes,
            "total_recipes": total_recipes
        }

    except Exception as e:
        print(f"❌ Error fetching recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")

    finally:
        cursor.close()
        conn.close()
        print("🔻 Database connection closed.")
