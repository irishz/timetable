import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./Context/AuthContext";
import Login from "./Login";
import AdminFormular from "./pages/Admin/AdminFormular/AdminFormular";
import FormularEdit from "./pages/Admin/AdminFormular/FormularEdit";
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
          <Route path="/admin-formular">
            <Route index element={<AdminFormular />} />
            <Route path=":id" element={<FormularEdit />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
