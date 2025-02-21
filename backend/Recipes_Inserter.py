import mysql.connector as sql
import pandas as pd
import socket
import json, sys

socket.setdefaulttimeout(5)

# Establish a connection
try:
    conn = sql.connect(
        host="dbhost.cs.man.ac.uk",
        user="y46354js",
        password="G53uPmjfOvBqLXrunGlcjdFRbSSxT9HtWk3P3oAEkTs",
        database="2024_comp10120_cm5",
        connection_timeout=5
    )
    db = True
except:
    print("Failed to connect to university server")
    conn = sql.connect(
        host="localhost",     # or "127.0.0.1"
        user="root",
        password="1234abcd",
        database="RecipEase"
    )
    db = False


# Check if connection was successful
if conn.is_connected():
    db_msg = "university" if db else "local"
    print(f"Connected to {db_msg} MySQL database")
    cursor = conn.cursor()

# Load CSV data
df = pd.read_csv("RAW_recipes.csv")

def Add_Rec(df, cursor, num=230186):
    # Function to safely convert list-like strings to JSON format
    def safe_json(value):
        if value is None or value == "nan":  # Double-check for missing values
            return json.dumps([])  # Store empty JSON array if missing
        try:
            return json.dumps(eval(value))  # Convert string representation of list to actual list
        except (ValueError, SyntaxError):
            return json.dumps([])  # Return empty list if conversion fails

    # Insert data into the database
    Records_Added = 0
    for _, row in df.iterrows():
        try:
            cursor.execute(
                """INSERT INTO recipes (RecipeId, Name, Ingredients, RecipeInstructions, CookTime, PrepTime, TotalTime, Images, RecipeCategory, AggregatedRating, Calories)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    row['RecipeId'], 
                    row['Name'],
                    safe_json(row['Ingredients']),  # Convert to JSON safely
                    safe_json(row['RecipeInstructions']),  # Convert to JSON safely
                    row['CookTime'],
                    row['PrepTime'],
                    row['TotalTime'],
                    row['Images'],
                    row['RecipeCategory'],
                    row['AggregatedRating'],
                    row['Calories']
                )
            )

            recipe_id = cursor.lastrowid  # Get inserted recipe ID

            # Process ingredients
            ingredients = eval(row['ingredients']) if isinstance(row['ingredients'], str) else []
            for ingredient in ingredients:
                cursor.execute("INSERT IGNORE INTO ingredients (name) VALUES (%s)", (ingredient,))
                cursor.execute("SELECT id FROM ingredients WHERE name = %s", (ingredient,))
                ingredient_id = cursor.fetchone()[0]

            # Link recipe to ingredient
            cursor.execute("INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES (%s, %s)",
                        (recipe_id, ingredient_id))
        except:
            continue
        
        # Track insertion progress
        Records_Added += 1   
        print(f"Records added: {Records_Added}/{num} ({round(100*Records_Added/num)}%)")
        sys.stdout.write("\033[F") 
        if Records_Added >= num:
            break

    
Add_Rec(df, cursor, 10000)

# Commit and close the connection
conn.commit()
cursor.close()
conn.close()
print("Program ran successfully.")