import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import TimeTable from "./TimeTable";
import AdminItem from "./Admin/AdminItem";
import Login from "./Login";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <nav></nav>

    <Routes>
      <Route exact path="/" element={<App />}></Route>
      <Route path="/timetable" element={<TimeTable />}></Route>
      <Route path="/login" element={<Login />}></Route>
      {/* Admin Route */}
      <Route path="/admin/item" element={<AdminItem />}></Route>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
