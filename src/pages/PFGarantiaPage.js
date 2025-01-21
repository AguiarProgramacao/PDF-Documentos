import React, { useState, useRef } from "react";
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
    const dataEmissao = new Date().toLocaleDateString();

    const doc = new jsPDF({ unit: "px", format: [842, 595], orientation: "landscape" });

    doc.addImage(PFImageBase64, "PNG", 0, 0, 842, 595);

    doc.setFontSize(15);
    doc.setFont("helvetica", "normal");
    const inputs = document.querySelectorAll(".input");

    const estabelecimento = inputs[0].value;
    doc.text(`ertificamos que o serviço de ${inputs[3].value}, realizado na data ${dataEmissao}, está garantido pelo período de ${inputs[5].value},`, 143, 247);
    doc.text(` a contar da data da prestação de serviço. Realizado no local ${estabelecimento}, no endereço ${inputs[2].value}, com o CPF/CNPJ ${inputs[1].value}.`, 65, 267, { maxWidth: 730 });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Valor:", 100, 370);
    doc.setFont("helvetica", "normal");
    const valor = parseFloat(inputs[6].value);
    if (!isNaN(valor)) {
      const valorFormatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      doc.text(valorFormatado, 190, 370);
    } else {
      doc.text("Valor inválido", 210, 370);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Data:", 600, 370);
    doc.setFont("helvetica", "normal");
    doc.text(`${dataEmissao}`, 700, 370);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Descrição:", 100, 420);
    doc.setFont("helvetica", "normal");
    doc.text(`${inputs[4].value}`, 190, 420);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Garantia:", 600, 420);
    doc.setFont("helvetica", "normal");
    doc.text(`${inputs[5].value}`, 700, 420);

    doc.setFont("helvetica", "bold");
    doc.text(`Representante do ${estabelecimento}`, 100, 500);
    doc.setFont("helvetica", "normal");
    doc.text(`${inputs[7].value}`, 120, 520)


    if (signature) {
      doc.text("P&F Dedetizadora", 600, 500);
      doc.addImage(signature, "PNG", 580, 485, 200, 100);
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
        <input className="input" style={styles.input} type="text" placeholder="Nome do Estabelecimento" />
        <input className="input" style={styles.input} type="text" placeholder="CPF/CNPJ" />
        <input className="input" style={styles.input} type="text" placeholder="Endereço" />
        <input className="input" style={styles.input} type="text" placeholder="Serviço" />
        <input className="input" style={styles.input} type="text" placeholder="Descrição do Serviço" />
        <input className="input" style={styles.input} type="text" placeholder="Tempo de Garantia" />
        <input className="input" style={styles.input} type="text" placeholder="Valor" />
        <input className="input" style={styles.input} type="text" placeholder="Nome do Representante" />
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
    height: "100vh",
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