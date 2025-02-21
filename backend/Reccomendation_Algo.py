import mysql.connector as sql
import json

def get_db_connection():
    """Establish a connection to the MySQL database."""
    conn = sql.connect(
        host="dbhost.cs.man.ac.uk",
        user="y46354js",
        password="G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs",
        database="2024_comp10120_cm5"
    )
    return conn

def recommend_recipes(ingredients):
    """Fetch recipes that match the given ingredients, ranked by match count."""
    conn = get_db_connection()
    if not conn:
        return {"error": "Database connection failed"}
    
    cursor = conn.cursor(dictionary=True)
    if not ingredients:
        return {"message": "No ingredients provided."}
    
    format_strings = ','.join(['%s'] * len(ingredients))
    query = f"""
        SELECT r.RecipeId, r.Name, r.RecipeInstructions, r.Ingredients, r.CookTime, r.PrepTime, r.TotalTime, r.RecipeCategory, r.Images, r.AggregatedRating, r.Calories, COUNT(ri.IngredientId) AS match_count
        FROM recipes r
        JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId
        JOIN ingredients i ON ri.IngredientId = i.IngredientId
        WHERE i.Name IN ({format_strings})
        GROUP BY r.RecipeId
        ORDER BY match_count DESC;
    """
    
    cursor.execute(query, tuple(ingredients))
    recipes = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return {"suggested_recipes": recipes} if recipes else {"message": "No matching recipes found."}
