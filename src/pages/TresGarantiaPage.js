import React, { useState, useRef } from "react";
import "./styles.css";
import Header from "../components/HeaderComponent";
import { jsPDF } from "jspdf";
import PFImage from "../assets/tres-irmaos.png";
import SignatureCanvas from "react-signature-canvas";

export default function TresGarantia() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureData, setSignatureData] = useState("");
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
    const signature = signatureData;
    const PFImageBase64 = await loadImageAsBase64(PFImage);

    const doc = new jsPDF({ unit: "px", format: [842, 595], orientation: "landscape" });

    doc.addImage(PFImageBase64, "PNG", 0, 0, 842, 595);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("P&F Garantia", 421, 40, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome do Estabelecimento: ${document.querySelectorAll(".input")[0].value}`, 40, 100);
    doc.text(`CPF/CNPJ: ${document.querySelectorAll(".input")[1].value}`, 40, 120);
    doc.text(`Endereço: ${document.querySelectorAll(".input")[2].value}`, 40, 140);
    doc.text(`Serviço: ${document.querySelectorAll(".input")[3].value}`, 40, 160);
    doc.text(`Descrição do Serviço: ${document.querySelectorAll(".input")[4].value}`, 40, 180);
    doc.text(`Tempo de Garantia: ${document.querySelectorAll(".input")[5].value}`, 40, 200);
    doc.text(`Valor: ${document.querySelectorAll(".input")[6].value}`, 40, 220);
    doc.text(`Nome do Representante: ${document.querySelectorAll(".input")[7].value}`, 40, 240);

    if (signature) {
      doc.text("Assinatura:", 40, 300);
      doc.addImage(signature, "PNG", 40, 320, 200, 100);
    }

    const pdfOutput = doc.output("bloburl");

    const message = encodeURIComponent("Olá, aqui está a garantia: ");
    const whatsappLink = `https://wa.me/?text=${message}${encodeURIComponent(pdfOutput)}`;

    window.open(whatsappLink, "_blank");
  };

  const clearSignature = () => {
    signatureCanvasRef.current.clear();
    setSignatureData("");
  };

  const saveSignature = () => {
    const signature = signatureCanvasRef.current.toDataURL();
    setSignatureData(signature);
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <div className="header">
        <Header />
        <h1 className="title-pf">P&F Garantia</h1>
      </div>
      <div className="container-inputs">
        <input className="input" type="text" placeholder="Nome do Estabelecimento" />
        <input className="input" type="text" placeholder="CPF/CNPJ" />
        <input className="input" type="text" placeholder="Endereço" />
        <input className="input" type="text" placeholder="Serviço" />
        <input className="input" type="text" placeholder="Descrição do Serviço" />
        <input className="input" type="text" placeholder="Tempo de Garantia" />
        <input className="input" type="text" placeholder="Valor" />
        <input className="input" type="text" placeholder="Nome do Representante" />
      </div>

      <button className="button-page" onClick={() => setIsModalOpen(true)}>
        Assinar
      </button>

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
        Gerar e Enviar Proposta via WhatsApp
      </button>
    </div>
  );
}
