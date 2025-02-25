from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import mysql.connector as sql
import json

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
            LIMIT 10;
        """
        cursor.execute(query, tuple(request.ingredients))
        recipes = cursor.fetchall()

        # Process the recipes before returning
        processed_recipes = []
        for recipe in recipes:
            if recipe["RecipeInstructions"]:
                # Handle different formats of instructions
                if isinstance(recipe["RecipeInstructions"], str):
                    try:
                        # Try to parse as JSON first
                        recipe["RecipeInstructions"] = json.loads(recipe["RecipeInstructions"])
                    except json.JSONDecodeError:
                        # If not JSON, split by periods for steps
                        recipe["RecipeInstructions"] = [step.strip() for step in recipe["RecipeInstructions"].split('.') if step.strip()]
            else:
                recipe["RecipeInstructions"] = ["No instructions available."]
            processed_recipes.append(recipe)

        return {"suggested_recipes": processed_recipes}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")