import React, { useState, useEffect } from "react";
import "../styles/FlipCard.css";
import axios from "axios";

const FlipCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [perks, setPerks] = useState([]);

  useEffect(() => {
    if (card) {
      axios
        .get(`http://localhost:8081/api/perks/card/${card.id}`)
        .then((res) => setPerks(res.data))
        .catch((err) => console.error("Error loading perks", err));
    }
  }, [card]);

  if (!card) return <p></p>;

  return (
    <div className="flipcard-container">
      <div
        className={`Cflip-card ${isFlipped ? "flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="Cflip-card-inner">
          {/* Front Side */}
          <div className="Cflip-card-front">
            <img src={card.imageUrl} alt={card.name} className="card-img" />
          </div>
  
          {/* Back Side */}
          <div className="Cflip-card-back">
            <div className="card-info">
              <h3>{card.name}</h3>
              <p><strong>Annual Fee:</strong> ${card.annualFee}</p>
              <p><strong>Rewards:</strong> {card.rewards}</p>
              <p><strong>Welcome Bonus:</strong> {card.welcomeBonus}</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Perks Table Always Below */}
      <div className="perks-table-container">
        <table className="comparision-perks-table">
          <thead>
            <tr>
              <th>Perks</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {perks.length ? (
              perks.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td className="perk-detail">
                    {p.detail.toLowerCase() === "not included" ? (
                      <span className="icon-cross">✖</span>
                    ) : (
                      <span className="icon-check">✔</span>
                    )}{" "}
                    {p.detail}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">Loading perks...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default FlipCard;
