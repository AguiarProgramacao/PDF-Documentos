import React, { useState, useRef } from "react";
import "./styles.css";
import Header from "../components/HeaderComponent";
import { FaFile, FaSignature } from "react-icons/fa";
import { jsPDF } from "jspdf";
import PFImage from "../assets/bg-pf.png";
import SignatureCanvas from "react-signature-canvas";
import FooterComponent from "../components/FooterComponent";

export default function PFProposta() {
  const [formData, setFormData] = useState({
    estabelecimento: "",
    cpfCnpj: "",
    endereco: "",
    servico: "",
    descricaoServico: "",
    valor: "",
    parcelas: "",
    valorCartao: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureData, setSignatureData] = useState("");
  const signatureCanvasRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
    doc.text("P&F Proposta", 105, 40, null, null, "center");

    // Adicionar dados do formulário
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nome do Estabelecimento: ${formData.estabelecimento}`, 20, 80);
    doc.text(`CPF/CNPJ: ${formData.cpfCnpj}`, 20, 100);
    doc.text(`Endereço: ${formData.endereco}`, 20, 120);
    doc.text(`Serviço: ${formData.servico}`, 20, 140);
    doc.text(`Descrição do Serviço: ${formData.descricaoServico}`, 20, 160);
    doc.text(`Valor: ${formData.valor}`, 20, 180);
    doc.text(`Quantidade de Parcelas: ${formData.parcelas}`, 20, 200);
    doc.text(`Valor no Cartão: ${formData.valorCartao}`, 20, 220);

    // Adicionar a assinatura (caso tenha)
    if (signatureData) {
      doc.text("Assinatura:", 20, 240);
      doc.addImage(signatureData, "PNG", 20, 250, 170, 50); // Assinatura no PDF
    }

    // Baixar o PDF
    doc.save("PF_Proposta.pdf");
  };

  const clearSignature = () => {
    signatureCanvasRef.current.clear();
    setSignatureData(""); // Limpar assinatura salva
  };

  const saveSignature = () => {
    const signature = signatureCanvasRef.current.toDataURL();
    setSignatureData(signature); // Salvar assinatura
    setIsModalOpen(false); // Fechar o modal
  };

  return (
    <div style={styles.container}>
      <Header title="P&F Proposta" />
      <div style={styles.containerInput}>
        <input
          style={styles.input}
          type="text"
          name="estabelecimento"
          placeholder="Nome do Estabelecimento"
          value={formData.estabelecimento}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="cpfCnpj"
          placeholder="CPF/CNPJ"
          value={formData.cpfCnpj}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={formData.endereco}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="servico"
          placeholder="Serviço"
          value={formData.servico}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="descricaoServico"
          placeholder="Descrição do Serviço"
          value={formData.descricaoServico}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="valor"
          placeholder="Valor"
          value={formData.valor}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="parcelas"
          placeholder="Quantidade de Parcelas"
          value={formData.parcelas}
          onChange={handleInputChange}
        />
        <input
          style={styles.input}
          type="text"
          name="valorCartao"
          placeholder="Valor no Cartão"
          value={formData.valorCartao}
          onChange={handleInputChange}
        />
      </div>

      <button
        style={styles.signatureButton}
        onClick={() => setIsModalOpen(true)}
      >
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
              canvasProps={{
                width: 350,
                height: 300,
                styles: "border: 1px solid #ccc, marginTop: 20px",
              }}
            />
            <div style={styles.containerButton}>
              <button style={styles.buttonSave} onClick={saveSignature}>
                Salvar Assinatura
              </button>
              <button style={styles.buttonClean} onClick={clearSignature}>
                Limpar Assinatura
              </button>
            </div>
            <button
              style={styles.buttonExit}
              onClick={() => setIsModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <button style={styles.buttonPost} onClick={generatePDF}>
        <FaFile size={20} />
        Gerar Proposta
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
    paddingInline: "1.1em",
  },
  input: {
    border: "none",
    borderBottom: "1px solid #FFF",
    backgroundColor: "transparent",
    marginBottom: "1.8em",
    fontSize: "17px",
    color: "#FFF",
  },
  containerInput: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: "40px",
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
    marginTop: "1.8em",
    width: "100%",
    marginLeft: "0px",
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
    marginLeft: "0px",
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
    alignItems: "center",
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
    marginTop: "20px",
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
    fontWeight: "bold",
  },
  buttonClean: {
    padding: "0.8em",
    backgroundColor: "#84B026",
    border: "none",
    borderRadius: "5px",
    color: "#FFF",
    fontWeight: "bold",
  },
  buttonExit: {
    padding: "0.8em",
    backgroundColor: "#07C7F2",
    border: "none",
    borderRadius: "5px",
    color: "#FFF",
    fontWeight: "bold",
    width: "70%",
  },
};
