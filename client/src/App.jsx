import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Intro from "./pages/Intro/Intro";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import MyStuff from "./pages/MyStuff/MyStuff";
import Manga from "./pages/Manga/manga";
import Shows from "./pages/Shows/Shows";
import MyShows from "./pages/MyShows/MyShows";
import Settings from "./pages/setting/setting";
import Review from "./pages/Review/Review";
import "./styles/globals.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/intro" replace />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/index" element={<Home />} />
            <Route path="/myStuff" element={<MyStuff />} />
            <Route path="/manga" element={<Manga />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/myShows" element={<MyShows />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;