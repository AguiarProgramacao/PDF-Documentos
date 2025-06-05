import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Page1 from "./pages/HomePage";
import TresGarantia from "./pages/TresGarantiaPage";
import PFGarantia from "./pages/PFGarantiaPage";
import PFProposta from "./pages/PFPropostaPage";
import TresProposta from "./pages/TresPropostaPage";
import ImuniGarantia from "./pages/ImuniGarantia";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/tres-garantia" element={<TresGarantia />} />
        <Route path="/pf-garantia" element={<PFGarantia />} />
        <Route path="/pf-proposta" element={<PFProposta />} />
        <Route path="/tres-proposta" element={<TresProposta />} />
        <Route path="/imuni-garantia" element={<ImuniGarantia />} />
      </Routes>
    </Router>
  );
}

export default App;
