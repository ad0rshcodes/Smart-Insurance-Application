import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PolicyCatalog from "./pages/PolicyCatalog";
import PolicyDetails from "./pages/PolicyDetails";
import PurchaseConfirmation from "./pages/PurchaseConfirmation";
import Profile from "./pages/Profile";
import WalletLink from "./pages/WalletLink";
import Claims from "./pages/Claims";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<PolicyCatalog />} />
        <Route path="/policy/:id" element={<PolicyDetails />} />
        <Route path="/confirm-purchase" element={<PurchaseConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/link-wallet" element={<WalletLink />} />
        <Route path="/claims" element={<Claims />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
