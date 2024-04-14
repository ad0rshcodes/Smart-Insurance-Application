import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PolicyCatalog from "./pages/PolicyCatalog";
import PurchaseConfirmation from "./pages/PurchaseConfirmation";
import WalletLink from "./pages/WalletLink";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<PolicyCatalog />} />
        <Route path="/confirm-purchase" element={<PurchaseConfirmation />} />
        <Route path="/link-wallet" element={<WalletLink />} />
      </Routes>
    </Router>
  );
}
