import LoginPage from "./components/views/LoginPage";
import MainPage from "./components/views/MainPage";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/main' element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
