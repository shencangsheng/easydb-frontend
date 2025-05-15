import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Notebook from "./pages/notebook";

// Changed to default import
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notebook" element={<Notebook />} />
      </Routes>
    </Router>
  );
}

export default App;
