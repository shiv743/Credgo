import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../styles/ReviewPage.css";

const ReviewPage = () => {
  const [cards, setCards] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
  const [isPaused, setIsPaused] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8081/api/cards"),
      axios.get("http://localhost:8081/api/reviews/allcards")
    ]).then(([cardsRes, reviewsRes]) => {
      setCards(cardsRes.data);
      setReviews(reviewsRes.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = cards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(results);
    } else {
      setFilteredCards([]);
    }
  }, [searchTerm, cards]);

  const reviewedCardIds = [...new Set(reviews.map(r => r.cardId))];
  const cardsWithReviews = cards.filter(card => reviewedCardIds.includes(card.id));

  const groupedReviews = cardsWithReviews.flatMap((card) =>
    reviews
      .filter((r) => r.cardId === card.id)
      .map((r) => ({ ...r, cardName: card.name }))
  );

  // Infinite loop by duplicating the first few reviews
  const clonedReviews = [...groupedReviews, ...groupedReviews.slice(0, 4)];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || groupedReviews.length === 0) return;

    const cardWidth = 340; // includes margin
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!isPaused) {
        scrollAmount += cardWidth;
        container.scrollBy({ left: cardWidth, behavior: "smooth" });

        if (scrollAmount >= cardWidth * groupedReviews.length) {
          setTimeout(() => {
            container.scrollTo({ left: 0, behavior: "auto" });
            scrollAmount = 0;
          }, 500);
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [groupedReviews, isPaused]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedCard) return;
    const payload = { ...newReview, cardId: selectedCard.id };
    axios.post("http://localhost:8081/api/reviews", payload).then((res) => {
      setReviews([...reviews, res.data]);
      setNewReview({ name: "", rating: 0, comment: "" });
      setSelectedCard(null);
      setSearchTerm("");
    });
  };

  if (loading) return <div className="loading">Loading reviews...</div>;

  return (
    <div className="review-page">
      <h2>What People Are Saying</h2>
      <div
        className="review-grid"
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {clonedReviews.map((review, index) => (
          <div className="review-card fade-slide" key={`${review.id}-${index}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="60"
              height="60"
              className="quote-icon"
              fill="currentColor"
            >
              <path d="M28 20c-6 2-10 6-12 12s-2 12 0 18h16c2-4 2-9 2-14h-6c0-4 2-7 6-8V20zm40 0c-6 2-10 6-12 12s-2 12 0 18h16c2-4 2-9 2-14h-6c0-4 2-7 6-8V20z" />
            </svg>

            <div className="review-rating">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>
                  {i < Math.floor(review.rating) ? "★" : i < review.rating ? "⯪" : "☆"}
                </span>
              ))}
              <span className="rating-number">{review.rating.toFixed(1)}</span>
            </div>

            <div className="review-body">
              <p>“{review.comment}”</p>
            </div>

            <div className="review-footer">
              <span>-{review.name || "Anonymous"}</span><br />
              <small style={{ color: "#94a3b8", fontStyle: "italic" }}>
                {review.cardName}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Review Form */}
      <div className="review-form-section">
        <h3>Leave a Review</h3>
        <input
          type="text"
          placeholder="Search card name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchTerm.length >= 2 && filteredCards.length > 0 && !selectedCard && (
          <ul className="card-suggestions">
            {filteredCards.map((card) => (
              <li key={card.id} onClick={() => {
                setSelectedCard(card);
                setSearchTerm(card.name);
                setFilteredCards([]);
              }}>
                {card.name}
              </li>
            ))}
          </ul>
        )}

        {selectedCard && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            />

            <label>Rating: {newReview.rating}</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
            />

            <label>Comment:</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            ></textarea>

            <button type="submit">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
