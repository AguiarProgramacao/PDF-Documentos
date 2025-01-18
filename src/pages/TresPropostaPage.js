import React from "react";
import "./styles.css"
import Header from "../components/HeaderComponent";
import { FiFile } from "react-icons/fi";

export default function TresProposta() {
  return (
    <div className="container">
      <div className="header">
        <Header />
        <h1 className="title-pages">3 irmãos Proposta</h1>
      </div>
      <div className="container-inputs">
        <input className="input" type="text" placeholder="Nome do Estabelecimento" />
        <input className="input" type="text" placeholder="CPF/CNPJ" />
        <input className="input" type="text" placeholder="Endereço" />
        <input className="input" type="text" placeholder="Serviço" />
        <input className="input" type="text" placeholder="Descrição do Serviço" />
        <input className="input" type="text" placeholder="Valor" />
        <input className="input" type="text" placeholder="Quantidade de Parcelas" />
        <input className="input" type="text" placeholder="Valor no Cartão" />
      </div>
      <button className="button-page">
        <FiFile /> 
        Gerar Proposta PDF
      </button>
    </div>
  );
}