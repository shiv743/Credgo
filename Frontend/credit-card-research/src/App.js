import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Reviews from "./components/Reviews";
import CreditCardList from "./components/CreditCardList";
import TermsOfService from "./components/TermsOfService";
import About from "./components/About";
import PrivacyPolicy from "./components/PrivacyPolicy";

const App = () => {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/category/:category" element={<CreditCardList />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
