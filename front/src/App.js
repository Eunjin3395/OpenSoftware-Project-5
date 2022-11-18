import LoginPage from "./components/views/LoginPage";
import LobbyPage from "./components/views/LobbyPage";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/main' element={<LobbyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
