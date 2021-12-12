import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './teg/Login'
import Sala from './teg/Sala'
import Mapa from './teg/Mapa';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/sala" element={<Sala/>} />
        <Route path="/mapa" element={<Mapa/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
