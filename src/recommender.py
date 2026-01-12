import pandas as pd

data = {
    "user_id": ["U1","U1","U1","U2","U2","U3","U3","U3","U4"],
    "product_id": ["P1","P2","P3","P1","P4","P2","P3","P5","P1"],
    "watch_time": [120, 30, 200, 60, 180, 40, 90, 300, 20],
    "action": ["wishlist","view","cart","view","cart","wishlist","view","cart","view"]
}

df = pd.DataFrame(data)
print(df)

action_score = {
    "view": 1,
    "wishlist": 5,
    "cart": 8,
    "purchase": 15
}

df["interest"] = df["action"].map(action_score)

# add watch time influence
df["interest"] = df["interest"] + (df["watch_time"] / 60)

print(df)

user_product = df.pivot_table(
    index="user_id",
    columns="product_id",
    values="interest",
    aggfunc="sum",
    fill_value=0
)

print(user_product)

from sklearn.metrics.pairwise import cosine_similarity

similarity = cosine_similarity(user_product)
sim_df = pd.DataFrame(similarity, index=user_product.index, columns=user_product.index)

print(sim_df)

def recommend(user_id, top_n=2):
    similar_users = sim_df[user_id].sort_values(ascending=False)[1:]
    top_user = similar_users.index[0]

    scores = user_product.loc[top_user]
    return scores.sort_values(ascending=False).head(top_n)

print("Recommendations for U1:")
print(recommend("U1"))