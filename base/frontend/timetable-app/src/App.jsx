import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./Context/AuthContext";
import Login from "./Login";
import AdminFormula from "./pages/Admin/AdminFormula/AdminFormula";
import FormulaCreate from "./pages/Admin/AdminFormula/FormulaCreate";
import FormulaEdit from "./pages/Admin/AdminFormula/FormulaEdit";
import CreateTime from "./pages/Admin/AdminTime/CreateTime";
import Navigation from "./pages/Navigation/Navigation";
import NotFound from "./pages/NotFound";
import Time from "./pages/Time/Time";

function App() {
  const [userToken, setuserToken] = useState(localStorage.getItem("token"));

  if (!userToken) {
    return <Login setuserToken={setuserToken} />;
  }

  return (
    <>
      <AuthContext.Provider value={{ setuserToken: setuserToken, userToken }}>
        <Navigation />
        <Routes>
          {/* <Route path="/" element={<Time />} /> */}
          <Route path="/time" element={<Time />} />
          <Route path="/admin-time/new" element={<CreateTime />} />
          <Route path="/admin-formula">
            <Route index element={<AdminFormula />} />
            <Route path=":id" element={<FormulaEdit />} />
            <Route path="new" element={<FormulaCreate />} />
          </Route>
          <Route path="/test" element={<Test />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
