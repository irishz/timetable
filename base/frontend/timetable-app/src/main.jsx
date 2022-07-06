import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import TimeTable from "./Time";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/time">TimeTable</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/time" element={<TimeTable />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);