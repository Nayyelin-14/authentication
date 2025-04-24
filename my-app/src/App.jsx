import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Forgotpassword from "./pages/Forgotpassword";
import Register from "./pages/Register";
import VerfiyEmail from "./pages/VerfiyEmail";
import ResetPassword from "./pages/ResetPassword";

export const Home = () => {
  return <div className="text-red-300">Hwlello</div>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/password/forgot" element={<Forgotpassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email/verify/:code" element={<VerfiyEmail />} />
      <Route path="/password/reset" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
