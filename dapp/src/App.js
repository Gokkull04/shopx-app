// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShopPage from "./pages/ShopPage";
import SellingPage from "./pages/SellingPage";
import Home from "./pages/Home";

const App = () => {
  return (

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/sell" element={<SellingPage />} />
        </Routes>
      </Router>
  );
};

export default App;
