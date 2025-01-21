import React, { useState, useRef } from "react";
import Header from "../components/HeaderComponent";
import { jsPDF } from "jspdf";
import PFImage from "../assets/tres-irmaos.png";
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
    const dataEmissao = new Date().toLocaleDateString();
  
    doc.addImage(PFImageBase64, "PNG", 0, 0, 842, 595);
  
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
  
    const inputs = document.querySelectorAll(".input");
    const estabelecimento = inputs[0].value;
    const endereco = inputs[2].value;
    const cpfCnpj = inputs[1].value;
    const servico = inputs[3].value;
    const valor = parseFloat(inputs[6].value);
  
    // Formatação do valor em BRL
    const valorFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  
    // Texto principal com alinhamento centralizado
    const texto = `Certificamos que o(a) ${estabelecimento}, localizado à ${endereco}, sob o CPF/CNPJ ${cpfCnpj}, efetuou o serviços de orçamento para serviço(s) de ${servico}. O valor foi de ${valorFormatado} reais. Utilizamos produtos registrados e aprovados pela ANVISA, em espaços comuns e contratados junto à Três Irmãos Sanitização, sob o CNPJ 37.580.098/0001-09, no dia ${dataEmissao}.`;
  
    doc.text(texto, 421, 170, { maxWidth: 650, align: "center" });
  
    // Assinatura
    doc.setFont("helvetica", "normal");
    if (signature) {
      doc.addImage(signature, "PNG", 320, 430, 200, 100);
      doc.text("________________", 421, 480, { align: "center" });
    }
  
    doc.setFontSize(22);
    doc.text("Assinatura do responsável", 421, 500, { align: "center" });
  
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
      <Header title="3 Irmãos Garantia" />
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