import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PolicyCatalog from "./pages/PolicyCatalog";
import PurchaseConfirmation from "./pages/PurchaseConfirmation";
import Profile from "./pages/Profile";
import WalletLink from "./pages/WalletLink";
// import FlightTracker from "./FlightTracker"; // Importing FlightTracker component

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<PolicyCatalog />} />
        <Route path="/confirm-purchase" element={<PurchaseConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/link-wallet" element={<WalletLink />} />
        {/* <Route path="/track-flight" element={<FlightTracker />} />{" "} */}
      </Routes>
    </Router>
  );
}
