import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function HomePage() {
  const navigate = useNavigate();

  return(
    <div className="container">
      <p className="title">
        Olá, chefe!!
        <br />
        Qual vai ser o documente de hoje?
      </p>
      <div className="container-buttons">
        <button className="tres" onClick={() => navigate("/tres-garantia")}>3 Irmãos Garantia</button>
        <button className="tres" onClick={() => navigate("/tres-proposta")}>3 Irmãos Proposta</button>
        <button className="pf" onClick={() => navigate("/pf-garantia")}>P&F Garantia</button>
        <button className="pf" onClick={() => navigate("/pf-proposta")}>P&F Proposta</button>
        <button className="imuni">ImuniGávea Garantia</button>
      </div>
    </div>
  );
}