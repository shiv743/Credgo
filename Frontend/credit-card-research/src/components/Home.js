import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import "../styles/Home.css";
import CreditCardComparison from "./CreditCardComparison";
import FeaturedCarousel from "./FeaturedCarousel";
import FloatingChatbotWrapper from "./FloatingChatbotWrapper";

const Home = () => {
  const [values, setValues] = useState({
    restaurants: 0,
    groceries: 0,
    bills: 0,
    gas: 0,
    travel: 0,
    entertainment: 0,
    pharmacy: 0,
    other: 0,
  });

  const handleInputChange = (key, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setValues({ ...values, [key]: parseInt(numericValue || "0", 10) });
  };

  const [featuredCards, setFeaturedCards] = useState([]);

  useEffect(() => {
    const fetchFeatured = () => {
      axios.get("http://localhost:8081/api/cards/featured")
        .then(res => {
          const shuffled = res.data.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 4);
          setFeaturedCards(selected);
        })
        .catch(err => console.error("Error fetching featured cards:", err));
    };

    fetchFeatured(); // Initial fetch
    const interval = setInterval(fetchFeatured, 5 * 60 * 1000); // refresh every 5 mins

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll(".stat-number");
    const duration = 2000;
    const frameRate = 20;
    const totalFrames = duration / frameRate;

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-value");
      let current = 0;
      const increment = target / totalFrames;

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = `${target}+`;
          clearInterval(interval);
        } else {
          counter.innerText = `${Math.ceil(current)}+`;
        }
      }, frameRate);
    });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const totalExpenses = Object.values(values).reduce((a, b) => a + b, 0);

  return (
    <div className="home-container">
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + '/parallax-bg.png'})`,
        }}
      ></div>

      <section className="card-section fade-in" data-aos="fade-up">
        <h2>Explore Card Categories</h2>
        <div className="card-grid-row">
          <div className="card glass-card"><img src="/travel.png" alt="Travel" /><Link to="/category/Travel">Travel Cards</Link></div>
          <div className="card glass-card"><img src="/cashback.png" alt="Cash Back" /><Link to="/category/CashBack">Cash Back</Link></div>
          <div className="card glass-card"><img src="/no-anualfee.png" alt="No Annual Fee" /><Link to="/category/NoAnnualFee">No Annual Fee</Link></div>
        </div>
        <div className="card-grid-row">
          <div className="card glass-card"><img src="/new-comer.png" alt="Newcomer" /><Link to="/category/Newcomer">Newcomer Cards</Link></div>
          <div className="card glass-card"><img src="/no-fx-fee.png" alt="No FX Fee" /><Link to="/category/NoFXFee">No FX Fee</Link></div>
        </div>
      </section>

      <div className="section-divider"></div>

      {featuredCards.length > 0 && (
        <FeaturedCarousel featuredCards={featuredCards} />
      )}

      <div className="section-divider"></div>

      <section className="info-section fade-in" data-aos="fade-up">
        <div className="blog-section">
          <h2>Learn More About Credit Cards</h2>
          <div className="blog-cards">
            <div className="blog-card">
              <h3>Choose the Right Credit Card</h3>
              <p>Discover key factors when comparing travel, cashback, and low-interest cards.</p>
              <a href="https://www.canada.ca/en/financial-consumer-agency/services/credit-cards/choose-credit-card.html" target="_blank">Read More →</a>
            </div>
            <div className="blog-card">
              <h3>Understanding Credit Scores</h3>
              <p>Your credit score affects approvals and rates. Learn how to maintain it.</p>
              <a href="https://www.canada.ca/en/financial-consumer-agency/services/credit-reports-score/credit-report-score-basics.html" target="_blank">Read More →</a>
            </div>
            <div className="blog-card">
              <h3>Maximizing Rewards</h3>
              <p>Tips on how to get the most from your spending with reward cards.</p>
              <a href="https://www.debt.ca/blog/maximizing-reward-point-programs" target="_blank">Read More →</a>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-icon">💳</span>
            <div className="stat-text">
              <h3 className="stat-number" data-value="120">0+</h3>
              <p className="stat-label">Total Cards</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🙋‍♂️</span>
            <div className="stat-text">
              <h3 className="stat-number" data-value="5000">0+</h3>
              <p className="stat-label">Users Helped</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📂</span>
            <div className="stat-text">
              <h3 className="stat-number" data-value="5">0+</h3>
              <p className="stat-label">Categories</p>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔍</span>
            <div className="stat-text">
              <h3 className="stat-number" data-value="150">0+</h3>
              <p className="stat-label">Daily Searches</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      <section className="middle-section fade-in" data-aos="fade-up">
        <h2>Credit Card Expenses Calculator</h2>
        <div className="expense-grid">
          <div className="expense-item total-expense">
            <label>Monthly expenses</label>
            <p>${totalExpenses.toLocaleString()}</p>
          </div>
          {Object.keys(values).map((key) => (
            <div key={key} className="expense-item">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="text"
                value={`$${values[key]}`}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"></div>

      <section id="compare" className="bottom-section fade-in" data-aos="fade-up">
        <CreditCardComparison />
      </section>

      {/* Floating Chatbot Widget */}
      <FloatingChatbotWrapper />
    </div>
  );
};

export default Home;
