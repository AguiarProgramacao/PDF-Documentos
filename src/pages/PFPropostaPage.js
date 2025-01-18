import React, { useState, useRef } from "react";
import "./styles.css";
import Header from "../components/HeaderComponent";
import { FiFile } from "react-icons/fi";
import { jsPDF } from "jspdf";
import PFImage from "../assets/bg-pf.png"; // Caminho para a imagem
import SignatureCanvas from "react-signature-canvas";

export default function PFProposta() {
  const [isModalOpen, setIsModalOpen] = useState(false);  // Controla a exibição do modal
  const [signatureData, setSignatureData] = useState(""); // Para armazenar a assinatura
  const signatureCanvasRef = useRef(null);

  const loadImageAsBase64 = async (imagePath) => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generatePDF = async () => {
    const PFImageBase64 = await loadImageAsBase64(PFImage);

    // Criar instância do jsPDF no formato portrait (A4)
    const doc = new jsPDF("p", "mm", "a4");

    // Definir a imagem de fundo
    doc.addImage(PFImageBase64, "PNG", 0, 0, 210, 297);

    // Adicionar título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("P&F Proposta", 297, 40, null, null, "center");

    // Adicionar dados do estabelecimento
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome do Estabelecimento: ${document.querySelectorAll(".input")[0].value}`, 40, 100);
    doc.text(`CPF/CNPJ: ${document.querySelectorAll(".input")[1].value}`, 40, 120);
    doc.text(`Endereço: ${document.querySelectorAll(".input")[2].value}`, 40, 140);
    doc.text(`Serviço: ${document.querySelectorAll(".input")[3].value}`, 40, 160);
    doc.text(`Descrição do Serviço: ${document.querySelectorAll(".input")[4].value}`, 40, 180);
    doc.text(`Valor: ${document.querySelectorAll(".input")[5].value}`, 40, 200);
    doc.text(`Quantidade de Parcelas: ${document.querySelectorAll(".input")[6].value}`, 40, 220);
    doc.text(`Valor no Cartão: ${document.querySelectorAll(".input")[7].value}`, 40, 240);

    // Adicionar a assinatura (caso tenha)
    if (signatureData) {
      doc.text("Assinatura:", 40, 300);
      doc.addImage(signatureData, "PNG", 40, 320, 200, 100); // Assinatura no PDF
    }

    // Gerar o PDF e salvar em uma URL ou sistema de armazenamento
    const pdfOutput = doc.output("bloburl");

    // Gerar link para o WhatsApp com a URL do arquivo
    const message = encodeURIComponent("Olá, aqui está a proposta: ");
    const whatsappLink = `https://wa.me/?text=${message}${encodeURIComponent(pdfOutput)}`;

    // Abrir WhatsApp
    window.open(whatsappLink, "_blank");
  };

  const clearSignature = () => {
    signatureCanvasRef.current.clear();
    setSignatureData("");  // Limpar assinatura salva
  };

  const saveSignature = () => {
    const signature = signatureCanvasRef.current.toDataURL();
    setSignatureData(signature);  // Salvar assinatura
    setIsModalOpen(false);  // Fechar o modal
  };

  return (
    <div className="container">
      <div className="header">
        <Header />
        <h1 className="title-pf">P&F Proposta</h1>
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

      {/* Botão para abrir o modal de assinatura */}
      <button className="button-page" onClick={() => setIsModalOpen(true)}>
        Assinar
      </button>

      {/* Modal de assinatura */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Assine abaixo</h2>
            <SignatureCanvas
              ref={signatureCanvasRef}
              backgroundColor="white"
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: "signature-canvas" }}
            />
            <div>
              <button onClick={saveSignature}>Salvar Assinatura</button>
              <button onClick={clearSignature}>Limpar Assinatura</button>
            </div>
            <button onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      <button className="button-page" onClick={generatePDF}>
        <FiFile />
        Gerar e Enviar Proposta via WhatsApp
      </button>
    </div>
  );
}
