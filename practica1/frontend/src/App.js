import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Calc from "./components/Calc";
import Log from "./components/Log";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Calc />} />
        <Route path='/log' element={<Log />} />
      </Routes>
    </Router>
  );
}

export default App;