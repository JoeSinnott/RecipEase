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
    """Connects to MySQL database and returns the connection."""
    try:
        conn = sql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        print("✅ Database connection successful!")
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
    print(f"🔍 Received ingredients: {request.ingredients}")  # Debugging

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = conn.cursor(dictionary=True)

    try:
        if not request.ingredients:
            raise HTTPException(status_code=400, detail="No ingredients provided.")

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

        if not recipes:
            print("⚠️ No recipes found for the given ingredients.")
            return {"suggested_recipes": []}

        # ✅ Debugging: Print raw database response
        print("✅ Raw database response:", recipes)

        # Process the recipes before returning
        processed_recipes = []
        for recipe in recipes:
            # ✅ Convert field names to match frontend expectations
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

            # ✅ Handle recipe instructions (ensure it's an array)
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

        # ✅ Debugging: Print processed response
        print("✅ Processed API response:", processed_recipes)

        return {"suggested_recipes": processed_recipes}

    except Exception as e:
        print(f"❌ Error fetching recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")

    finally:
        cursor.close()
        conn.close()
        print("🔻 Database connection closed.")
