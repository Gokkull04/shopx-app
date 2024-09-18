// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // Home page
import ShopPage from "./pages/ShopPage"; // Shop page
import SellingPage from "./pages/SellingPage"; // Selling page

function App() {
  return (
    <Router>
      <div>
        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/sell" element={<SellingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
