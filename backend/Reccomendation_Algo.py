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
    
    # Create a LIKE condition for each ingredient (e.g., '%ingredient%')
    like_conditions = [f"i.Name LIKE %s" for _ in ingredients]
    format_strings = ' OR '.join(like_conditions)  # Join the conditions with 'OR'
    
    query = f"""
        SELECT r.RecipeId, r.Name, r.RecipeInstructions, r.Ingredients, r.CookTime, r.PrepTime, r.TotalTime, r.RecipeCategory, r.Images, r.AggregatedRating, r.Calories, COUNT(ri.IngredientId) AS match_count
        FROM recipes r
        JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId
        JOIN ingredients i ON ri.IngredientId = i.IngredientId
        WHERE {format_strings}
        GROUP BY r.RecipeId
        ORDER BY match_count DESC;
    """
    
    # Add '%' around each ingredient to match partial strings in the LIKE condition
    ingredients_like = [f"%{ingredient}%" for ingredient in ingredients]
    
    cursor.execute(query, tuple(ingredients_like))
    recipes = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return {"suggested_recipes": recipes} if recipes else {"message": "No matching recipes found."}
