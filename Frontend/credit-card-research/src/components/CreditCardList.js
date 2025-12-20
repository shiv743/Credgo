import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/CreditCardList.css";
import FlipCardWithDetails from "./FlipCardWithDetails"; // Flip Card component

const CreditCardList = () => {
  const { category } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8081/api/cards/category/${encodeURIComponent(category)}`)
      .then((response) => {
        setCards(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
        setError("Failed to load credit cards.");
        setLoading(false);
      });
  }, [category]);

  return (
    <div className="credit-card-list">
      <h1>{category} Credit Cards</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {cards.length > 0 ? (
        <div className="card-grid">
          {cards.map((card) => (
            <div key={card.id} className="card-container">
              <FlipCardWithDetails card={card} />
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No credit cards available for {category}.</p>
      )}
    </div>
  );
};

export default CreditCardList;
