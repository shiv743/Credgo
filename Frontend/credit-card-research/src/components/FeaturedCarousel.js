import React, { useRef } from "react";
import "../styles/FeaturedCarousel.css";

const FeaturedCarousel = ({ featuredCards }) => {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">🔥 Featured Credit Cards</h2>
      <div className="carousel-container">
        <div className="carousel-track" ref={scrollRef}>
          {featuredCards.map((card) => (
            <div key={card.id} className="carousel-card glass-card">
              <img src={card.imageUrl} alt={card.name} className="card-image" />
              <div className="card-info">
                <h3>{card.name}</h3>
                <p>{card.rewards}</p>
                <p><strong>Bonus:</strong> {card.welcomeBonus}</p>
                <a
                className="apply-btn"
                href={card.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                >
                Apply Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
