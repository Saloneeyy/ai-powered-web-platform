from fastapi import FastAPI
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# ----- DATA -----
data = {
    "user_id": ["U1","U1","U1","U2","U2","U3","U3","U3","U4"],
    "product_id": ["P1","P2","P3","P1","P4","P2","P3","P5","P1"],
    "watch_time": [120, 30, 200, 60, 180, 40, 90, 300, 20],
    "action": ["wishlist","view","cart","view","cart","wishlist","view","cart","view"]
}

df = pd.DataFrame(data)

action_score = {"view":1, "wishlist":5, "cart":8, "purchase":15}
df["interest"] = df["action"].map(action_score) + (df["watch_time"]/60)

user_product = df.pivot_table(
    index="user_id",
    columns="product_id",
    values="interest",
    aggfunc="sum",
    fill_value=0
)

similarity = cosine_similarity(user_product)
sim_df = pd.DataFrame(similarity, index=user_product.index, columns=user_product.index)

# ----- API -----

@app.get("/")
def home():
    return {"message": "KRITI Recommendation API running 💖"}

@app.get("/recommend/{user_id}")
def recommend(user_id: str, top_n: int = 3):
    if user_id not in sim_df.columns:
        return {"error": "User not found"}

    similar_users = sim_df[user_id].sort_values(ascending=False)[1:]
    top_user = similar_users.index[0]

    scores = user_product.loc[top_user].sort_values(ascending=False)
    recs = scores.head(top_n).to_dict()

    return {
        "user": user_id,
        "based_on": top_user,
        "recommendations": recs
    }