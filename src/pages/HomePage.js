import React from "react";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";

export default function HomePage() {
  const navigate = useNavigate();

  // Estilos como objetos
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "94vh",
      backgroundColor: "#161F30",
      padding: "1.5em",
    },
    title: {
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#FFF",
      marginBottom: "2em",
    },
    containerButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "0.7em",
    },
    button: {
      padding: "1em",
      border: "none",
      borderRadius: "8px",
      fontSize: "1em",
      fontWeight: "bold",
    },
    tres: {
      backgroundColor: "#84B026",
    },
    pf: {
      backgroundColor: "#07C7F2",
      color: "#FFF",
    },
    imuni: {
      backgroundColor: "#3D3D3D",
      color: "#FFF",
    },
  };

  return (
    <div style={styles.container}>
      <p style={styles.title}>
        Olá, chefe!!
        <br />
        Qual vai ser o documente de hoje?
      </p>
      <div style={styles.containerButtons}>
        <button style={{ ...styles.button, ...styles.tres }} onClick={() => navigate("/tres-garantia")}>
          3 Irmãos Garantia
        </button>
        <button style={{ ...styles.button, ...styles.tres }} onClick={() => navigate("/tres-proposta")}>
          3 Irmãos Proposta
        </button>
        <button style={{ ...styles.button, ...styles.pf }} onClick={() => navigate("/pf-garantia")}>
          P&F Garantia
        </button>
        <button style={{ ...styles.button, ...styles.pf }} onClick={() => navigate("/pf-proposta")}>
          P&F Proposta
        </button>
        <button style={{ ...styles.button, ...styles.imuni }}>
          ImuniGávea Garantia
        </button>
      </div>
      <FooterComponent />
    </div>
  );
}