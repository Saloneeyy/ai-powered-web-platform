import { useState, useEffect } from "react";

export default function App() {
  const [page, setPage] = useState("account");
  const [cartFlash, setCartFlash] = useState(false);
  const [analytics, setAnalytics] = useState([]); // store analytics
  const [recommendations, setRecommendations] = useState([]); // store recommendations

  // fetch analytics when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics")
      .then(res => res.json())
      .then(data => setAnalytics(data.products))
      .catch(err => console.error(err));
  }, []);

  // fetch recommendations for user U1 (example)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/recommend/U1")
      .then(res => res.json())
      .then(data => setRecommendations(Object.entries(data.recommendations)))
      .catch(err => console.error(err));
  }, []);

  const handleAddToCart = () => {
    setCartFlash(true);
    setTimeout(() => setCartFlash(false), 400);
  };

  return (
    <div style={styles.bg}>
      <div style={styles.appContainer}>
        {page === "home" && <Home onAdd={handleAddToCart} />}
        {page === "search" && <Search />}
        {page === "fav" && <Fav />}
        {page === "account" && (
          <Account goSignup={() => setPage("signup")}>
            <h2>Product Analytics:</h2>
            <ul>
              {analytics.map((p, idx) => (
                <li key={idx}>
                  {p.product_id}: Views({p.views}), Wishlist({p.wishlist}), Cart({p.cart})
                </li>
              ))}
            </ul>

            <h2>Recommendations for U1:</h2>
            <ul>
              {recommendations.map(([product, score], idx) => (
                <li key={idx}>
                  {product}: {score.toFixed(2)}
                </li>
              ))}
            </ul>
          </Account>
        )}
        {page === "signup" && <SignUp goLogin={() => setPage("account")} />}
        {page === "cart" && <Cart />}

        {/* NAV */}
        <div style={styles.nav}>
          <button onClick={() => setPage("home")}>🏠</button>
          <button onClick={() => setPage("search")}>🔍</button>
          <button onClick={() => setPage("fav")}>❤️</button>
          <button onClick={() => setPage("account")}>👤</button>

          <button
            onClick={() => setPage("cart")}
            style={{
              ...styles.cartBtn,
              ...(cartFlash ? styles.cartFlash : {}),
            }}
          >
            🛍
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= LOGIN ================= */
function Account({ goSignup }) {
  return (
    <div style={styles.authBg}>
      <div style={styles.overlay}></div>

      <div style={styles.authBox}>
        <h2>Welcome to KRITI 💅</h2>

        <div style={styles.inputBox}>
          <input placeholder="Email" style={styles.input} />
        </div>

        <div style={styles.inputBox}>
          <input type="password" placeholder="Password" style={styles.input} />
        </div>

        <button style={styles.loginBtn}>LOGIN</button>

        <p style={styles.linkText}>
          Don’t have an account?{" "}
          <span onClick={goSignup} style={styles.link}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= SIGNUP ================= */
function SignUp({ goLogin }) {
  return (
    <div style={styles.authBg}>
      <div style={styles.overlay}></div>

      <div style={styles.authBox}>
        <h2>Join KRITI 💖</h2>

        <div style={styles.inputBox}>
          <input placeholder="Name" style={styles.input} />
        </div>

        <div style={styles.inputBox}>
          <input placeholder="Email" style={styles.input} />
        </div>

        <div style={styles.inputBox}>
          <input type="password" placeholder="Password" style={styles.input} />
        </div>

        <button style={styles.loginBtn}>SIGN UP</button>

        <p style={styles.linkText}>
          Already a baddie?{" "}
          <span onClick={goLogin} style={styles.link}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================= SEARCH ================= */
function Search() {
  return (
    <div style={{ padding: 10 }}>
      <h3 style={{ textAlign: "center", color: "#ffd1ea" }}>
        Search your character 💫
      </h3>

      <input placeholder="Search your character..." style={styles.searchBar} />
    </div>
  );
}

/* ================= FAV ================= */
function Fav() {
  return <h3 style={{ textAlign: "center" }}>Your Favourites 💖</h3>;
}

/* ================= HOME ================= */
function Home({ onAdd }) {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/recommend/U1")
      .then((res) => res.json())
      .then((data) => {
        if (data.recommendations) {
          const arr = Object.entries(data.recommendations).map(
            ([id, score]) => ({ id, score })
          );
          setRecs(arr);
        }
      });
  }, []);

  return (
    <div>
      <h3 style={styles.slayText}>Recommended for you bestie 💖✨</h3>

      <div style={styles.digicamGrid}>
        {recs.map((p) => (
          <div key={p.id} style={styles.digicamCard}>
            <div style={styles.cameraBar}>
              <span>REC ●</span>
              <span>{p.id}</span>
            </div>

            <div style={styles.digicamImg}></div>

            <div style={styles.priceStrip}>
              <span>Trending Pick</span>
              <span>🔥</span>
            </div>

            <button style={styles.addBtn} onClick={onAdd}>
              add to bag 🛍️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ================= CART ================= */
function Cart() {
  const items = [
    { id: 1, name: "Drama Queen Tee", price: "₹599" },
    { id: 2, name: "Hot Mess Crop", price: "₹499" },
  ];

  return (
    <div>
      <h3 style={styles.cartTitle}>your bag bestie 🛍💖</h3>

      <div style={styles.cartList}>
        {items.map((item) => (
          <div key={item.id} style={styles.cartItem}>
            <div style={styles.cartImg}></div>

            <div style={styles.cartInfo}>
              <p style={styles.cartName}>{item.name}</p>
              <p style={styles.cartPrice}>{item.price}</p>
            </div>

            <button style={styles.removeBtn}>✕</button>
          </div>
        ))}
      </div>

      <div style={styles.checkoutBox}>
        <div style={styles.totalRow}>
          <span>Total</span>
          <span>₹1098</span>
        </div>
        <button style={styles.checkoutBtn}>Checkout 💳✨</button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  bg: {
    minHeight: "100vh",
    background: "#050b1f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  appContainer: {
  width: "90vw",
  maxWidth: 1100,
  height: "85vh",
  background: "#0b1b3a",
  borderRadius: 25,
  padding: 25,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
},

  nav: {
  position: "absolute",
  bottom: 15,
  left: "50%",
  transform: "translateX(-50%)",
  width: 400,
  background: "white",
  borderRadius: 20,
  display: "flex",
  justifyContent: "space-around",
  padding: 12,
},

  cartBtn: { transition: "0.2s" },
  cartFlash: {
    transform: "scale(1.4) rotate(-10deg)",
    background: "#ff9ecf",
    borderRadius: "50%",
  },

  authBg: {
    height: "100%",
    backgroundImage: "url('/images/background.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "left center",
    borderRadius: 20,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    borderRadius: 20,
  },
  authBox: {
    position: "relative",
    zIndex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    textAlign: "center",
  },

  inputBox: {
    background: "#ffffff22",
    borderRadius: 12,
    marginTop: 12,
    padding: 10,
  },
  input: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
  },
  loginBtn: {
    marginTop: 15,
    padding: 12,
    borderRadius: 15,
    border: "none",
    fontWeight: "bold",
  },
  linkText: { fontSize: 12, marginTop: 8 },
  link: { textDecoration: "underline", cursor: "pointer" },

  searchBar: {
    width: "100%",
    padding: 12,
    borderRadius: 20,
    border: "none",
  },

  slayText: {
    textAlign: "center",
    color: "#ffd1ea",
    marginBottom: 8,
  },

  digicamGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 20,
},
  
  cameraBar: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#ff9ecf",
  },
  digicamImg: {
    height: 110,
    background: "#ffffff22",
    borderRadius: 15,
    marginTop: 6,
  },
  priceStrip: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  addBtn: {
    marginTop: 6,
    width: "100%",
    borderRadius: 12,
    background: "#ff9ecf",
    border: "none",
    padding: 8,
  },

  cartTitle: { textAlign: "center", color: "#ffd1ea" },
  cartList: { marginTop: 10, display: "flex", flexDirection: "column", gap: 10 },
  cartItem: {
    display: "flex",
    background: "#ffffff18",
    borderRadius: 15,
    padding: 8,
    alignItems: "center",
  },
  cartImg: {
    width: 50,
    height: 50,
    background: "#ffffff33",
    borderRadius: 10,
    marginRight: 10,
  },
  cartInfo: { flex: 1 },
  cartPrice: { color: "#ff9ecf" },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#ff9ecf",
    fontSize: 18,
  },
  checkoutBox: {
    position: "absolute",
    bottom: 80,
    left: 15,
    right: 15,
    background: "#0b1b3a",
    borderRadius: 20,
    padding: 12,
  },
  totalRow: { display: "flex", justifyContent: "space-between" },
  checkoutBtn: {
    width: "100%",
    marginTop: 8,
    padding: 10,
    borderRadius: 15,
    border: "none",
    background: "#ff9ecf",
  },
};