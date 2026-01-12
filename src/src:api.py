# api.py

from fastapi import FastAPI
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from fastapi.middleware.cors import CORSMiddleware

# ---------------- FastAPI App ----------------
app = FastAPI(title="KRITI Recommendation API")

# Enable CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all domains for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- SAMPLE USER DATA ----------------
data = {
    "user_id": ["U1","U1","U1","U2","U2","U3","U3","U3","U4"],
    "product_id": ["P1","P2","P3","P1","P4","P2","P3","P5","P1"],
    "watch_time": [120,30,200,60,180,40,90,300,20],
    "action": ["wishlist","view","cart","view","cart","wishlist","view","cart","view"]
}

df = pd.DataFrame(data)

# ---------------- INTEREST SCORE ----------------
action_weight = {"view":1, "wishlist":3, "cart":5}
df["interest"] = df["watch_time"]/60 + df["action"].map(action_weight)

# ---------------- USER-PRODUCT MATRIX ----------------
matrix = df.pivot_table(index="user_id", columns="product_id", values="interest", fill_value=0)

# ---------------- USER SIMILARITY ----------------
similarity = cosine_similarity(matrix)
sim_df = pd.DataFrame(similarity, index=matrix.index, columns=matrix.index)

# ---------------- ROUTES ----------------

@app.get("/")
def root():
    return {"message": "KRITI Recommendation API running 💖"}

@app.get("/recommend/{user_id}")
def recommend(user_id: str):
    if user_id not in sim_df.index:
        return {"error": "User not found"}

    # Find top 2 similar users
    similar_users = sim_df[user_id].sort_values(ascending=False)[1:3]

    # Average interest scores from similar users
    rec_scores = matrix.loc[similar_users.index].mean().sort_values(ascending=False)

    # Exclude products user already interacted with
    rec_scores = rec_scores[matrix.loc[user_id] == 0]

    return {
        "user": user_id,
        "recommendations": rec_scores.head(3).to_dict()
    }

@app.get("/analytics")
def analytics():
    product_stats = (
        df.groupby("product_id")
        .agg(
            views=("action", lambda x: (x=="view").sum()),
            wishlist=("action", lambda x: (x=="wishlist").sum()),
            cart=("action", lambda x: (x=="cart").sum())
        )
        .reset_index()
    )
    return {"products": product_stats.to_dict(orient="records")}