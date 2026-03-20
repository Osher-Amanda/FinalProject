import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("listings");
  const [compare, setCompare] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("");

const API = "http://localhost:5001";
  // ================= FETCH LISTINGS =================
  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API}/listings`, {
        params: { minPrice, maxPrice, city }
      });
      setListings(res.data);
      setView("listings");
    } catch {
      setError("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH FAVORITES =================
  const fetchFavorites = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${API}/favorites`, {
      params: { user_id: 1 }
    });
      setFavorites(res.data);
      setView("favorites");
    } catch {
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  // ================= SAVE FAVORITE =================
  const saveFavorite = async (id) => {
  try {
    await axios.post(`${API}/favorites`, {
      user_id: 1,
      listing_id: id
    });
    alert("Saved ❤️");
  } catch (err) {
    if (err.response?.status === 500) {
      alert("Already saved ❤️");
    } else {
      alert("Server error");
    }
  }
};

const toggleCompare = (listing) => {
  if (compare.find(l => l.id === listing.id)) {
    setCompare(compare.filter(l => l.id !== listing.id));
  } else {
    if (compare.length >= 3) {
      alert("You can compare up to 3 listings");
      return;
    }
    setCompare([...compare, listing]);
  }
};

  // ================= REMOVE FAVORITE =================
  const removeFavorite = async (id) => {
    try {
      await axios.delete(`${API}/favorites/${id}`);
      setFavorites(favorites.filter(f => f.id !== id));
    } catch {
      alert("Failed to remove favorite");
    }
  };
  // ================= UI =================
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1>Rental Listings 🇮🇱</h1>

      {/* NAV */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={fetchListings}>🏠 Listings</button>
        <button onClick={fetchFavorites} style={{ marginLeft: 10 }}>
          ❤️ Favorites
        </button>
      </div>

      {/* FILTERS */}
      {view === "listings" && (
        <div style={{ marginBottom: 20 }}>
          <input
            type="number"
            placeholder="Min ₪"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max ₪"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ marginLeft: 10 }}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ marginLeft: 10 }}
          />
          <button onClick={fetchListings} style={{ marginLeft: 10 }}>
            Search
          </button>
        </div>
      )}

      {/* STATUS */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* LISTINGS */}
{view === "listings" &&
  listings.map((l) => (
    <Card
      key={l.id}
      listing={l}
      saveFavorite={saveFavorite}
      toggleCompare={toggleCompare}
      API={API}
    />
  ))}

      {/* FAVORITES */}
      {view === "favorites" &&
  favorites.map((l) => (
    <Card
  key={l.id}
  listing={l}
  removeFavorite={removeFavorite}
  toggleCompare={toggleCompare}
  API={API}
/>
))}
{/* ================= COMPARE TABLE ================= */}
{compare.length > 0 && (
  <div style={{ marginTop: 40 }}>
    <h2>Compare Listings ⚖️</h2>

    <table border="1" cellPadding="10">
      <thead>
        <tr>
        <th>Title</th>
<th>City</th>
<th>Price</th>
<th>Rooms</th>
<th>Size</th>
<th>Floor</th>
<th>Amenities</th>
<th>Commute</th>
<th>Pet Friendly</th>
        </tr>
      </thead>

      <tbody>
  {compare.map((l) => (
    <tr key={l.id}>
      <td>{l.title}</td>
      <td>{l.city}</td>
      <td>₪{l.price}</td>
      <td>{l.rooms}</td>
      <td>{l.size} m²</td>
      <td>{l.floor}</td>
      <td>{l.amenities}</td>
      <td>{l.commute}</td>
      <td>{l.pet_friendly ? "Yes" : "No"}</td>
    </tr>
  ))}
</tbody>
    </table>
  </div>
)}
    </div>
  );
}

// ================= CARD COMPONENT =================
function Card({ listing, saveFavorite, removeFavorite, toggleCompare, API }) {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/reviews/${listing.id}`);
      setReviews(res.data);
    } catch {
      console.log("Failed to load reviews");
    }
  };

  fetchReviews();
}, [listing.id]);

return (
  <div>
    <div style={{ marginTop: 10 }}>
      <h4>Reviews:</h4>

      {reviews.length === 0 && <p>No reviews yet</p>}

      {reviews.map((r) => (
        <p key={r.id}>
          ⭐ {r.rating} - {r.comment}
        </p>
      ))}
    </div>

    <div style={{
      border: "1px solid #ccc",
      padding: 15,
      marginBottom: 15,
      borderRadius: 8
    }}>
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p><b>City:</b> {listing.city}</p>
      <p><b>Price:</b> ₪{listing.price}</p>
<p><b>Rooms:</b> {listing.rooms}</p>
<p><b>Size:</b> {listing.size} m²</p>
<p><b>Floor:</b> {listing.floor}</p>
<p><b>Amenities:</b> {listing.amenities}</p>
<p><b>Commute:</b> {listing.commute}</p>
<p><b>Pet Friendly:</b> {listing.pet_friendly ? "🐶 Yes" : "❌ No"}</p>

      {saveFavorite && (
        <button onClick={() => saveFavorite(listing.id)}>
          ❤️ Save
        </button>
      )}
      {toggleCompare && (
        <button onClick={() => toggleCompare(listing)}>
          ⚖️ Compare
        </button>
      )}

      {removeFavorite && (
        <button onClick={() => removeFavorite(listing.id)}>
          ❌ Remove
        </button>
      )}

      <button onClick={async () => {
  const rating = prompt("Rate 1-5");
  const comment = prompt("Write a comment");

  await axios.post(`${API}/reviews`, {
    listing_id: parseInt(listing.id),
    rating,
    comment
  });

  // 🔥 RE-FETCH REVIEWS AFTER ADDING
  const res = await axios.get(`${API}/reviews/${listing.id}`);
  setReviews(res.data);

  alert("Review added ⭐");
}}>
  ⭐ Add Review
</button>
    </div>
  </div>
);
}
     
export default App;