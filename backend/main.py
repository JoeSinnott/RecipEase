from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from signup import router as signup_router
from login import router as login_router
from createrecipe import router as createrecipe_router
import mysql.connector as sql
import json
import os
from dotenv import load_dotenv
import user_recipes
from difflib import get_close_matches
from decimal import Decimal

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

# Include the user_recipes route
app.include_router(user_recipes.router)

# ✅ Manually Handle OPTIONS Request for CORS Preflight
@app.options("/recipes/suggest")
async def options_handler():
    return JSONResponse(status_code=200, headers={
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    })

# Add OPTIONS handler for advanced recipe recommendation endpoint
@app.options("/recipes/recommend")
async def recommend_options_handler():
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

# Add a new Pydantic model for user recipe requests
class UserRecipeRequest(BaseModel):
    page: int = 1
    per_page: int = 12

# Add a new Pydantic model for advanced recipe recommendations
class AdvancedRecipeRequest(BaseModel):
    ingredients: List[str]
    excluded_ingredients: Optional[List[str]] = []
    vegan_only: bool = False
    dairy_free: bool = False
    page: int = 1
    per_page: int = 12
    max_cooking_time: Optional[int] = None
    min_calories: Optional[float] = None
    max_calories: Optional[float] = None
    min_protein: Optional[float] = None
    max_protein: Optional[float] = None
    min_carbs: Optional[float] = None
    max_carbs: Optional[float] = None


# Helper functions from recommendation algorithm
def get_all_ingredients():
    """Fetch all ingredient names from the database to enable fuzzy matching."""
    conn = get_db_connection()
    if not conn:
        return []
    cursor = conn.cursor()
    cursor.execute("SELECT Name FROM ingredients")
    ingredients = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return ingredients

def fuzzy_match_ingredients(user_ingredients, all_ingredients):
    """Find the closest matching ingredient names in the database."""
    if not user_ingredients:
        return []
       
    matched_ingredients = []
    for ingredient in user_ingredients:
        close_matches = get_close_matches(ingredient, all_ingredients, n=1, cutoff=0.7)
        if close_matches:
            matched_ingredients.append(close_matches[0])  # Take the best match
        else:
            matched_ingredients.append(ingredient)  # If no match, use the original input
    return matched_ingredients

def decimal_serializer(obj):
    """Convert Decimal objects to float for JSON serialization."""
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

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
                "prepTime": recipe.pop("PrepTime", "N/A"),
                "cookTime": recipe.pop("CookTime", "N/A"),
                "totalTime": recipe.pop("TotalTime", "N/A"),
                "rating": recipe.pop("AggregatedRating", "N/A"),
                "calories": recipe.pop("Calories", "N/A"),
                "images": recipe.pop("Images", "/placeholder.jpg"),
                "ingredients": recipe.pop("Ingredients", "No ingredients listed"),
                "protein": recipe.pop("ProteinContent", "N/A"),
                "carbs": recipe.pop("CarbohydrateContent", "N/A"),
                "fat": recipe.pop("FatContent", "N/A"),
                "fiber": recipe.pop("FiberContent", "N/A"),
                "sugar": recipe.pop("SugarContent", "N/A"),
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

# New endpoint for advanced recipe recommendation
@app.post("/recipes/recommend")
def recommend_recipes(request: AdvancedRecipeRequest):
    """
    Fetches recipes that match the given ingredients while applying filters for:
    - Excluded ingredients
    - Vegan options
    - Dairy-free options
    With pagination support
    """
    print(f"🔍 Advanced recipe search with ingredients: {request.ingredients}")
    print(f"❌ Excluded ingredients: {request.excluded_ingredients}")
    print(f"🌱 Vegan only: {request.vegan_only}")
    print(f"🥛 Dairy free: {request.dairy_free}")

    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")

    cursor = conn.cursor(dictionary=True)

    try:
        if not request.ingredients:
            raise HTTPException(status_code=400, detail="No ingredients provided.")

        # Get all ingredient names for fuzzy matching
        all_ingredients = get_all_ingredients()
        matched_ingredients = fuzzy_match_ingredients(request.ingredients, all_ingredients)
        excluded_ingredients = fuzzy_match_ingredients(request.excluded_ingredients, all_ingredients) if request.excluded_ingredients else []

        print(f"🔄 Matched ingredients: {matched_ingredients}")
        print(f"🔄 Matched exclusions: {excluded_ingredients}")

        # Build the query conditions
        format_strings = ','.join(['%s'] * len(matched_ingredients))
        query_params = list(matched_ingredients)
        exclude_condition = ""
        filter_condition = ""
       
        if excluded_ingredients:
            exclude_placeholders = ','.join(['%s'] * len(excluded_ingredients))
            exclude_condition = f"""
                AND r.RecipeId NOT IN (
                    SELECT ri.RecipeId FROM recipe_ingredients ri
                    JOIN ingredients i ON ri.IngredientId = i.IngredientId
                    WHERE i.Name IN ({exclude_placeholders})
                )
            """
            query_params.extend(excluded_ingredients)
       
        if request.vegan_only:
            filter_condition += " AND NOT EXISTS (SELECT 1 FROM recipe_ingredients ri JOIN ingredients i ON ri.IngredientId = i.IngredientId WHERE ri.RecipeId = r.RecipeId AND i.Vegan = FALSE) "
       
        if request.dairy_free:
            filter_condition += " AND NOT EXISTS (SELECT 1 FROM recipe_ingredients ri JOIN ingredients i ON ri.IngredientId = i.IngredientId WHERE ri.RecipeId = r.RecipeId AND i.DairyFree = FALSE) "

        if request.max_cooking_time:
            # Convert minutes to seconds (multiply by 60)
            max_seconds = request.max_cooking_time * 60
            filter_condition += f" AND (r.TotalTime <= '{max_seconds}' OR r.CookTime <= '{max_seconds}') "
            
        # Add nutritional filters
        if request.min_calories is not None:
            filter_condition += f" AND r.Calories >= {request.min_calories} "
            
        if request.max_calories is not None:
            filter_condition += f" AND r.Calories <= {request.max_calories} "
            
        if request.min_protein is not None:
            filter_condition += f" AND r.ProteinContent >= {request.min_protein} "
            
        if request.max_protein is not None:
            filter_condition += f" AND r.ProteinContent <= {request.max_protein} "
            
        if request.min_carbs is not None:
            filter_condition += f" AND r.CarbohydrateContent >= {request.min_carbs} "
            
        if request.max_carbs is not None:
            filter_condition += f" AND r.CarbohydrateContent <= {request.max_carbs} "
            
        # First, get total count of matching recipes
        count_query = f"""
            SELECT COUNT(DISTINCT r.RecipeId) as total
            FROM recipes r
            JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId
            JOIN ingredients i ON ri.IngredientId = i.IngredientId
            WHERE i.Name IN ({format_strings})
            {exclude_condition}
            {filter_condition}
        """
        cursor.execute(count_query, tuple(query_params))
        total_recipes = cursor.fetchone()['total']

        # Calculate offset for pagination
        offset = (request.page - 1) * request.per_page

        # Main query with pagination
        query = f"""
            SELECT DISTINCT r.RecipeId, r.Name, r.RecipeInstructions, r.Ingredients,
                   r.CookTime, r.PrepTime, r.TotalTime, r.RecipeCategory,
                   r.Images, r.AggregatedRating, r.Calories, r.ProteinContent,
                   r.CarbohydrateContent, r.FatContent, r.FiberContent, r.SugarContent
            FROM recipes r
            JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId
            JOIN ingredients i ON ri.IngredientId = i.IngredientId
            WHERE i.Name IN ({format_strings})
            {exclude_condition}
            {filter_condition}
            GROUP BY r.RecipeId
            ORDER BY COUNT(DISTINCT i.IngredientId) DESC
            LIMIT %s OFFSET %s;
        """
        cursor.execute(query, tuple(query_params) + (request.per_page, offset))
        recipes = cursor.fetchall()

        if not recipes:
            print("⚠️ No recipes found for the given criteria.")
            return {"recommended_recipes": [], "total_recipes": 0}

        # Process the recipes before returning
        processed_recipes = []
        for recipe in recipes:
            processed_recipe = {
                "id": recipe.pop("RecipeId", None),
                "name": recipe.pop("Name", "Unnamed Recipe"),
                "category": recipe.pop("RecipeCategory", "N/A"),
                "prepTime": recipe.pop("PrepTime", "N/A"),
                "cookTime": recipe.pop("CookTime", "N/A"),
                "totalTime": recipe.pop("TotalTime", "N/A"),
                "rating": recipe.pop("AggregatedRating", "N/A"),
                "calories": recipe.pop("Calories", "N/A"),
                "images": recipe.pop("Images", "/placeholder.jpg"),
                "ingredients": recipe.pop("Ingredients", "No ingredients listed"),
                "protein": recipe.pop("ProteinContent", "N/A"),
                "carbs": recipe.pop("CarbohydrateContent", "N/A"),
                "fat": recipe.pop("FatContent", "N/A"),
                "fiber": recipe.pop("FiberContent", "N/A"),
                "sugar": recipe.pop("SugarContent", "N/A"),
            }

            # Fetch detailed ingredients for each recipe
            ingredient_query = """
                SELECT i.Name AS ingredient_name
                FROM recipe_ingredients ri
                JOIN ingredients i ON ri.IngredientId = i.IngredientId
                WHERE ri.RecipeId = %s;
            """
            cursor.execute(ingredient_query, (processed_recipe["id"],))
            detailed_ingredients = [row["ingredient_name"] for row in cursor.fetchall()]
            processed_recipe["detailed_ingredients"] = detailed_ingredients

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
            "recommended_recipes": processed_recipes,
            "total_recipes": total_recipes
        }

    except Exception as e:
        print(f"❌ Error fetching recipes: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching recipes: {str(e)}")

    finally:
        cursor.close()
        conn.close()
        print("🔻 Database connection closed.")