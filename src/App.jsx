import "./App.css";
import Home from "./components/Home/Home";

import { Routes, Route } from "react-router-dom";
import MyStake from "./components/MyStake/MyStake";
import Navbar from "./components/Home/Navbar/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myStake" element={<MyStake />} />
      </Routes>
    </div>
  );
}

export default App;
