import mysql.connector as sql

import json

from difflib import get_close_matches

from decimal import Decimal

import datetime

def convert_time_to_minutes(time_str):
    """Convert HH:MM:SS format to total minutes."""
    try:
        time_obj = datetime.datetime.strptime(time_str, "%H:%M:%S").time()
        return time_obj.hour * 60 + time_obj.minute  # Convert to minutes
    except ValueError:
        return None  # Handle incorrect format

# Example conversion in query processing
for recipe in recipes:
    recipe["CookTime"] = convert_time_to_minutes(recipe["CookTime"])
    recipe["PrepTime"] = convert_time_to_minutes(recipe["PrepTime"])
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


def recommend_recipes(user_ingredients, excluded_ingredients=None, vegan_only=False, dairy_free=False):

    """Fetch recipes that match the given ingredients while filtering based on dietary requirements."""

    conn = get_db_connection()

    if not conn:

        return {"error": "Database connection failed"}

  

    cursor = conn.cursor(dictionary=True)

    if not user_ingredients:

        return {"message": "No ingredients provided."}

  

    # Get all ingredient names for fuzzy matching

    all_ingredients = get_all_ingredients()

    matched_ingredients = fuzzy_match_ingredients(user_ingredients, all_ingredients)

    excluded_ingredients = fuzzy_match_ingredients(excluded_ingredients, all_ingredients) if excluded_ingredients else []

  

    try:

        # Create a dynamic query to match user ingredients and exclude unwanted ingredients

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

       

        if vegan_only:

            filter_condition += " AND NOT EXISTS (SELECT 1 FROM recipe_ingredients ri JOIN ingredients i ON ri.IngredientId = i.IngredientId WHERE ri.RecipeId = r.RecipeId AND i.Vegan = FALSE) "

       

        if dairy_free:

            filter_condition += " AND NOT EXISTS (SELECT 1 FROM recipe_ingredients ri JOIN ingredients i ON ri.IngredientId = i.IngredientId WHERE ri.RecipeId = r.RecipeId AND i.DairyFree = FALSE) "

       

        query = f"""

            SELECT r.RecipeId, r.Name AS recipe_name, r.RecipeInstructions AS instructions

            FROM recipes r

            JOIN recipe_ingredients ri ON r.RecipeId = ri.RecipeId

            JOIN ingredients i ON ri.IngredientId = i.IngredientId

            WHERE i.Name IN ({format_strings})

            {exclude_condition}

            {filter_condition}

            GROUP BY r.RecipeId

        """

      

        cursor.execute(query, tuple(query_params))

        recipes = cursor.fetchall()

      

        # Fetch ingredients for each recipe

        for recipe in recipes:

            ingredient_query = """

                SELECT i.Name AS ingredient_name

                FROM recipe_ingredients ri

                JOIN ingredients i ON ri.IngredientId = i.IngredientId

                WHERE ri.RecipeId = %s;

            """

            cursor.execute(ingredient_query, (recipe["RecipeId"],))

            recipe["ingredients"] = [row["ingredient_name"] for row in cursor.fetchall()]

      

        # Convert JSON fields to Python dictionaries

        for recipe in recipes:

            if isinstance(recipe["instructions"], str):

                try:

                    recipe["instructions"] = json.loads(recipe["instructions"])

                except json.JSONDecodeError:

                    recipe["instructions"] = "Invalid JSON format"

      

    except sql.Error as e:

        return {"error": f"SQL execution failed: {str(e)}"}

    finally:

        cursor.close()

        conn.close()

  

    return {

        "recommended_recipes": recipes if recipes else {"message": "No matching recipes found."}

    }


# Example test

if __name__ == "__main__":

    user_ingredients = ["tomato", "pasta","onions"]  # Example input

    excluded_ingredients = []  # Example exclusions

    recommendations = recommend_recipes(user_ingredients, excluded_ingredients, vegan_only=False, dairy_free= True)

    print(json.dumps(recommendations, indent=4, default=decimal_serializer))