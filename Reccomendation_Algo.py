import mysql.connector as sql
import json

def get_db_connection():
    """Establish a connection to the MySQL database."""
    try:
        conn = sql.connect(
            host="dbhost.cs.man.ac.uk",
            user="y46354js",
            password="G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs",
            database="2024_comp10120_cm5"
        )
        return conn
    except sql.Error as e:
        print(f"Database connection failed: {str(e)}")
        return None

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
        SELECT r.id, r.name, r.description, r.steps, COUNT(ri.ingredient_id) AS match_count
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE i.name IN ({format_strings})
        GROUP BY r.id
        ORDER BY match_count DESC;
    """
    
    cursor.execute(query, tuple(ingredients))
    recipes = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return {"suggested_recipes": recipes} if recipes else {"message": "No matching recipes found."}

# Example test
if __name__ == "__main__":
    user_ingredients = ["tomato", "cheese", "pasta"]  # Example input
    recommendations = recommend_recipes(user_ingredients)
    print(json.dumps(recommendations, indent=4))
