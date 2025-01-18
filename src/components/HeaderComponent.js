import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="header">
      <button className="button-return" onClick={() => navigate("/")}>
        <FiArrowLeft size={20} color="#FFF" />
      </button>
    </div>
  );
}
