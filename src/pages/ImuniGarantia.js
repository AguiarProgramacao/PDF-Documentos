import React, { useState, useRef } from "react";
import Header from "../components/HeaderComponent";
import { jsPDF } from "jspdf";
import Imuni from "../assets/Imuni.png";
import SignatureCanvas from "react-signature-canvas";
import { FaSignature, FaFile } from "react-icons/fa";
import FooterComponent from "../components/FooterComponent";

export default function ImuniGarantia() {
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
    const PFImageBase64 = await loadImageAsBase64(Imuni);

    const doc = new jsPDF({ unit: "px", format: [842, 595], orientation: "landscape" });

    doc.addImage(PFImageBase64, "PNG", 0, 0, 842, 595);

    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const inputs = document.querySelectorAll(".input");

    const estabelecimento = inputs[0].value;

    
    const data = inputs[7].value;
    const partes = data.split("-");
    const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`${dataFormatada}`, 700, 217);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`${inputs[5].value}`, 700, 236);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    const valor = parseFloat(inputs[6].value);
    if (!isNaN(valor)) {
      const valorFormatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      doc.text(valorFormatado, 700, 255);
    } else {
      doc.text("Valor inválido", 700, 255);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(`${inputs[0].value}`, 190, 316);
    doc.text(`${inputs[1].value}`, 190, 345);
    doc.text(`${inputs[2].value}`, 190, 375);
    doc.text(`${inputs[3].value}`, 190, 405);
    doc.text(`${inputs[4].value}`, 190, 435);
    
    if (signature) {
      doc.addImage(signature, "PNG", 30, 470, 200, 100);
    }

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
      <Header title="Imuni Garantia" />
      <div style={styles.containerInput}>
        <input className="input" style={styles.input} type="text" placeholder="Nome do Estabelecimento" />
        <input className="input" style={styles.input} type="text" placeholder="Endereço" />
        <input className="input" style={styles.input} type="text" placeholder="CPF/CNPJ" />
        <input className="input" style={styles.input} type="text" placeholder="Serviço" />
        <input className="input" style={styles.input} type="text" placeholder="Descrição do Serviço" />
        <input className="input" style={styles.input} type="text" placeholder="Tempo de Garantia" />
        <input className="input" style={styles.input} type="text" placeholder="Valor" />
        <input className="input" style={styles.input} type="date" placeholder="Data do Serviço" />
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
    minHeight: "100vh",
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
    marginBottom: "1em",
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