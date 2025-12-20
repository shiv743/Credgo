import React, { useState, useEffect } from "react";
import FlipCard from "./FlipCard";
import "../styles/CreditCardComparison.css";
import axios from "axios";

const CardSlot = ({ selectedCard, index, onSelectCard }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length > 1) {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/cards/search?name=${value}`
        );
        const results = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleCardSelect = (card) => {
    onSelectCard(index, card);
    setQuery(card.name);
    setSearchResults([]);
  };

  return (
    <div className="card-slot">
      <p>Select a credit card for comparison</p>
      <div className="search-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="Search credit card..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="search-suggestions">
            {searchResults.map((card) => (
              <li key={card.id} onClick={() => handleCardSelect(card)}>
                {card.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <FlipCard card={selectedCard} />
    </div>
  );
};

const CardComparison = () => {
  const [selectedCards, setSelectedCards] = useState([null, null, null]);
  const [perksData, setPerksData] = useState({});

  const handleSelectCard = (index, card) => {
    const updatedCards = [...selectedCards];
    updatedCards[index] = card;
    setSelectedCards(updatedCards);
  };

  // Fetch perks for selected cards
  useEffect(() => {
    const fetchPerks = async () => {
      const selected = selectedCards.filter(Boolean);
      if (selected.length === 0) return;

      try {
        const response = await axios.post(
          "http://localhost:8081/api/perks/comparison",
          { cardIds: selected.map((card) => card.id) }
        );
        setPerksData(response.data);
      } catch (error) {
        console.error("Error fetching perks data:", error);
      }
    };

    fetchPerks();
  }, [selectedCards]);

  const nonEmptyCards = selectedCards.filter(Boolean);

  return (
    <div className="comparison-container">
      <h2 className="comparison-title">Compare Credit Cards</h2>
      <p>Select up to 3 cards to compare</p>

      <div className="comparison-grid">
        {selectedCards.map((card, idx) => (
          <CardSlot
            key={idx}
            index={idx}
            selectedCard={card}
            onSelectCard={handleSelectCard}
          />
        ))}
      </div>
    </div>
  );
};

export default CardComparison;
