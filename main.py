from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from recommendation import recommend_recipes

app = FastAPI()

class IngredientsInput(BaseModel):
    ingredients: List[str]

@app.post("/recipes/suggest")
def suggest_recipes(user_input: IngredientsInput):
    recommendations = recommend_recipes(user_input.ingredients)
    
    if "error" in recommendations:
        raise HTTPException(status_code=500, detail=recommendations["error"])
    
    if not recommendations["suggested_recipes"]:
        raise HTTPException(status_code=404, detail="No matching recipes found.")
    
    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
