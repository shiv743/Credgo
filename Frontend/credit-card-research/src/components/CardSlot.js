import React, { useState } from "react";
import axios from "axios";
import FlipCard from "./FlipCard";
import "../styles/CreditCardComparison.css";

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
        // You can either expect an array or wrap the result:
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
    <div className="card-slot" style={{ position: "relative" }}>
      <FlipCard card={selectedCard} />

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
  );
};

export default CardSlot;
