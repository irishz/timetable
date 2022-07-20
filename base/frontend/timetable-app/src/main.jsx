import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import TimeTable from "./Time";
import CreateTime from "./Admin/AdminTime/CreateTime";
import AdminItem from "./Admin/AdminItem/AdminItem";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <nav className="p-3 text-lg ">
        <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/time">TimeTable</Link> |{" "}
        <Link to="/admin/time/create">Admin Time</Link> |{" "}
        <Link to="/admin/item/">Admin Item</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />} />
        <Route path="/time" element={<TimeTable />} />
        <Route path="/admin/time/create" element={<CreateTime />} />
        <Route path="/admin/item/" element={<AdminItem />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
