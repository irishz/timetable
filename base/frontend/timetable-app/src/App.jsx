import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./Context/AuthContext";
import Login from "./Login";
import AdminFormula from "./pages/Admin/AdminFormula/AdminFormula";
import FormulaCreate from "./pages/Admin/AdminFormula/FormulaCreate";
import FormulaEdit from "./pages/Admin/AdminFormula/FormulaEdit";
import AdminItem from "./pages/Admin/AdminItem/AdminItem";
import AdminItemCreate from "./pages/Admin/AdminItem/AdminItemCreate";
import AdminItemEdit from "./pages/Admin/AdminItem/AdminItemEdit";
import CreateTime from "./pages/Admin/AdminTime/CreateTime";
import Navigation from "./pages/Navigation/Navigation";
import NotFound from "./pages/NotFound";
import Time from "./pages/Time/Time";

function App() {
  const [userToken, setuserToken] = useState(localStorage.getItem("token"));

  if (!userToken) {
    return <Login setuserToken={setuserToken}/>;
  }

  const decoded_data = jwtDecode(userToken)
  const userData = decoded_data

  return (
    <>
      <AuthContext.Provider value={{ setuserToken: setuserToken, userToken, userData }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Time />} />
          <Route path="/time" element={<Time />} />
          <Route path="/admin-time/new" element={<CreateTime />} />
          <Route path="/admin-formula">
            <Route index element={<AdminFormula />} />
            <Route path=":id" element={<FormulaEdit />} />
            <Route path="new" element={<FormulaCreate />} />
          </Route>
          <Route path="/admin-item">
            <Route index element={<AdminItem />}/>
            <Route path="new" element={<AdminItemCreate />}/>
            <Route path=":id" element={<AdminItemEdit />}/>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
