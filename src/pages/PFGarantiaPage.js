import React, { useState, useRef } from "react";
import "./styles.css";
import Header from "../components/HeaderComponent";
import { jsPDF } from "jspdf";
import PFImage from "../assets/PF_Dedetizadora.png";
import SignatureCanvas from "react-signature-canvas";
import { FaSignature, FaFile } from "react-icons/fa";
import FooterComponent from "../components/FooterComponent";

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
    const inputs = document.querySelectorAll(".input");

    const estabelecimento = inputs[0].value;
    doc.text(`Nome do Estabelecimento: ${estabelecimento}`, 40, 100);
    doc.text(`CPF/CNPJ: ${inputs[1].value}`, 40, 120);
    doc.text(`Endereço: ${inputs[2].value}`, 40, 140);
    doc.text(`Serviço: ${inputs[3].value}`, 40, 160);
    doc.text(`Descrição do Serviço: ${inputs[4].value}`, 40, 180);
    doc.text(`Tempo de Garantia: ${inputs[5].value}`, 40, 200);
    doc.text(`Valor: ${inputs[6].value}`, 40, 220);
    doc.text(`Nome do Representante: ${inputs[7].value}`, 40, 240);

    if (signature) {
      doc.text("Assinatura:", 40, 300);
      doc.addImage(signature, "PNG", 40, 320, 200, 100);
    }

    // Salvar o PDF usando o nome do estabelecimento
    const fileName = estabelecimento ? `${estabelecimento}_Garantia.pdf` : "Garantia.pdf";
    doc.save(fileName);
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
    <div style={styles.container}>
      <Header title="P&F Garantia" />
      <div style={styles.containerInput}>
        <input style={styles.input} type="text" placeholder="Nome do Estabelecimento" />
        <input style={styles.input} type="text" placeholder="CPF/CNPJ" />
        <input style={styles.input} type="text" placeholder="Endereço" />
        <input style={styles.input} type="text" placeholder="Serviço" />
        <input style={styles.input} type="text" placeholder="Descrição do Serviço" />
        <input style={styles.input} type="text" placeholder="Tempo de Garantia" />
        <input style={styles.input} type="text" placeholder="Valor" />
        <input style={styles.input} type="text" placeholder="Nome do Representante" />
      </div>

      <button style={styles.signatureButton} onClick={() => setIsModalOpen(true)}>
        <FaSignature size={20} />
        Assinar
      </button>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Assine abaixo</h2>
            <SignatureCanvas
              ref={signatureCanvasRef}
              backgroundColor="transparent"
              penColor="black"
              canvasProps={{ width: 350, height: 300, styles: "border: 1px solid #ccc, marginTop: 20px" }}
            />
            <div style={styles.containerButton}>
              <button style={styles.buttonSave} onClick={saveSignature}>Salvar Assinatura</button>
              <button style={styles.buttonClean} onClick={clearSignature}>Limpar Assinatura</button>
            </div>
            <button style={styles.buttonExit} onClick={() => setIsModalOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      <button style={styles.buttonPost} onClick={generatePDF}>
        <FaFile size={20} />
        Gerar Garantia
      </button>
      <FooterComponent />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "93vh",
    backgroundColor: "#161F30",
    paddingInline: "1.1em"
  },
  input: {
    border: "none",
    borderBottom: "1px solid #FFF",
    backgroundColor: "transparent",
    marginBottom: "1.8em",
    fontSize: "17px",
    color: "#FFF"
  },
  containerInput: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: "40px"
  },
  signatureButton: {
    backgroundColor: "#07C7F2",
    border: "none",
    borderRadius: "5px",
    padding: "1em",
    color: "#FFF",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1.5em",
    width: "100%",
    marginLeft: "0px"
  },
  buttonPost: {
    backgroundColor: "#07C7F2",
    border: "none",
    borderRadius: "5px",
    padding: "1em",
    color: "#FFF",
    fontSize: "16px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginLeft: "0px"
  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "600px",
    textAlign: "center",
  },
  SignatureCanvas: {
    border: "1px solid #ccc",
    marginTop: "20px",
  },
  canvas: {
    border: "1px solid #ccc",
    marginTop: "20px"
  },
  containerButton: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  buttonSave: {
    padding: "0.8em",
    backgroundColor: "#84B026",
    border: "none",
    borderRadius: "5px",
    color: "#FFF",
    fontWeight: "bold"
  },
  buttonClean: {
    padding: "0.8em",
    backgroundColor: "#84B026",
    border: "none",
    borderRadius: "5px",
    color: "#FFF",
    fontWeight: "bold"
  },
  buttonExit: {
    padding: "0.8em",
    backgroundColor: "#07C7F2",
    border: "none",
    borderRadius: "5px",
    color: "#FFF",
    fontWeight: "bold",
    width: "70%"
  }
}