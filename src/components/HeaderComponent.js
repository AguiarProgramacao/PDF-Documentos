import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";


export default function Header({ title }) {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => navigate("/")}>
        <FiArrowLeft size={28} color="#FFF" />
      </button>
      <h1 style={styles.title}>{title}</h1>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    justifyContent: "center",
    position: "absolute",
    left: "-20px"
  },
  title: {
    color: "#FFF",
    fontweight: 'bold',
    textAlign: "center",
  },
}