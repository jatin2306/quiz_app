import React from "react";
import Questions from "./Components/Questions/Questions";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./Components/LoginForm/LoginForm";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/Quiz" element={<Questions />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
