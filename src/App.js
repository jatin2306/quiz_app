import React, { useState } from "react";
import Questions from "./Components/Questions/Questions";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginForm setLoading={setLoading} loading={loading} />}
          />
          <Route
            path="/Quiz"
            element={<Questions setLoading={setLoading} loading={loading} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
