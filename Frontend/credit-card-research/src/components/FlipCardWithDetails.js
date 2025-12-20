import React, { useState, useEffect } from "react";
import "../styles/FlipCardWithDetails.css";
import axios from "axios";

const FlipCardWithDetails = ({ card }) => {
  const [flipped, setFlipped] = useState(false);
  const [perks, setPerks] = useState([]);
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);

  useEffect(() => {
    if (flipped && card) {
      // Fetch perks
      axios
        .get(`http://localhost:8081/api/perks/card/${card.id}`)
        .then((res) => setPerks(res.data))
        .catch((err) => console.error("Perks fetch error:", err));

      // Fetch pros
      axios
        .get(`http://localhost:8081/api/pros/card/${card.id}`)
        .then((res) => setPros(res.data))
        .catch((err) => console.error("Pros fetch error:", err));

      // Fetch cons
      axios
        .get(`http://localhost:8081/api/cons/card/${card.id}`)
        .then((res) => setCons(res.data))
        .catch((err) => console.error("Cons fetch error:", err));
    }
  }, [flipped, card]);

  if (!card) return null;

  return (
    <div className={`flip-card ${flipped ? "flipped" : ""}`}>
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="card-info">
            <h2 className="card-title">{card.name}</h2>
            <div className="rating-stars">
              {Array.from({ length: 5 }, (_, i) => {
                const full = i + 1 <= Math.floor(card.rating);
                const half = i + 1 > card.rating && i < card.rating;

                return (
                  <span className="star" key={i}>
                    {full ? "★" : half ? "⯪" : "☆"}
                  </span>
                );
              })}
              <span className="rating-text">{card.rating.toFixed(1)} Rating</span>
            </div>
            {card.featured && (
              <span className="best-tag">Best for {card.category} Points</span>
            )}
            <div className="highlight">
              <span>First Year Reward</span>
              <h3>${card.yearlyCost}/yr</h3>
              <p>
                Based on spending $2,200/mo after ${card.annualFee} annual fee
              </p>
            </div>
            <div className="reward-details">
              <h4>Earn Rewards</h4>
              <p>{card.rewards}</p>
              <h4>Welcome Bonus</h4>
              <p>{card.welcomeBonus}</p>
            </div>
          </div>
          <div className="card-image-actions">
            <img src={card.imageUrl} alt={card.name} />
            <div className="button-row">
              <a
                className="btn-primary"
                href={card.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Site
              </a>
              <button
                className="btn-secondary"
                onClick={() => setFlipped(true)}
              >
                See Perks
              </button>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <h2 className="section-title">Perks of {card.name}</h2>

          {/* ⬇️ Perks Table */}
          <div className="perks-table-wrapper">
            <table className="perks-table">
              <thead>
                <tr>
                  <th>Perks</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {perks.length > 0 ? (
                  perks.map((perk, idx) => (
                    <tr key={idx}>
                      <td>{perk.name}</td>
                      <td>{perk.detail}</td>
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

          {/* Pros & Cons */}
          <div className="pros-cons">
            <h3 className="sub-title">Pros</h3>
            <ul>
              {pros.length > 0 ? (
                pros.map((pro, idx) => <li key={idx}>{pro.description}</li>)
              ) : (
                <li>Loading pros...</li>
              )}
            </ul>

            <h3 className="sub-title">Cons</h3>
            <ul>
              {cons.length > 0 ? (
                cons.map((con, idx) => <li key={idx}>{con.description}</li>)
              ) : (
                <li>Loading cons...</li>
              )}
            </ul>
          </div>

          <button className="btn-secondary" onClick={() => setFlipped(false)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipCardWithDetails;
