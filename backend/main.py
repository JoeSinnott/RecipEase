from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import mysql.connector as sql

# Initialize FastAPI app
app = FastAPI()

# ✅ CORS Middleware (Allow React frontend to access FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ Allow frontend access
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods
    allow_headers=["*"],  # ✅ Allow all headers
)

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
    """Connects to MySQL database and returns the connection."""
    try:
        conn = sql.connect(
            host="dbhost.cs.man.ac.uk",  # Use "localhost" if testing locally
            user="y46354js",
            password="G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs",
            database="2024_comp10120_cm5"
        )
        return conn
    except sql.Error as e:
        print(f"❌ Database connection failed: {str(e)}")
        return None

# ✅ Request model for recipe suggestions
class RecipeRequest(BaseModel):
    ingredients: List[str]

# ✅ Root endpoint (Test if API is running)
@app.get("/")
def read_root():
    return {"message": "API is working!"}

# ✅ API to suggest recipes based on ingredients
@app.post("/recipes/suggest")
def suggest_recipes(request: RecipeRequest):
    """Fetches recipes that contain the provided ingredients."""
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = conn.cursor(dictionary=True)

    try:
        # ✅ Ensure all required fields are included
        format_strings = ','.join(['%s'] * len(request.ingredients))
        query = f"""
            SELECT RecipeId, Name, RecipeInstructions, Ingredients, CookTime, PrepTime, TotalTime, RecipeCategory, Images, AggregatedRating, Calories
            FROM recipes
            WHERE RecipeId IN (
                SELECT RecipeId FROM recipe_ingredients
                WHERE IngredientId IN (
                    SELECT IngredientId FROM ingredients WHERE Name IN ({format_strings})
                )
            )
            GROUP BY RecipeId
            ORDER BY COUNT(RecipeId) DESC
            LIMIT 10;
        """
        cursor.execute(query, tuple(request.ingredients))
        recipes = cursor.fetchall()

        # ✅ Fix RecipeInstructions: Convert string to JSON list
        for recipe in recipes:
            if isinstance(recipe["RecipeInstructions"], str):
                recipe["RecipeInstructions"] = recipe["RecipeInstructions"].split(". ")  # Convert to list

        conn.close()

        if not recipes:
            return {"message": "No matching recipes found", "suggested_recipes": []}

        return {"suggested_recipes": recipes}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")