import React, { useState, useRef } from "react";
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

    const doc = new jsPDF("p", "mm", "a4");

    doc.addImage(PFImageBase64, "PNG", 0, 0, 210, 297);

    const valorReal = parseInt(formData.valor);
    const valorBRL = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorReal);

    // Dividir os itens de descrição do serviço por vírgula e remover espaços extras
    const descricaoServicos = formData.descricaoServico
      .split(",")
      .map((item) => item.trim());

    // Adicionar cabeçalho e informações principais
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Prezado Cliente,", 15, 65);
    const textPrincipal = `Apresentamos nosso orçamento referente ao serviço de ${formData.servico} no local ${formData.estabelecimento}, sob o CPF/CNPJ ${formData.cpfCnpj}, localizado no endereço ${formData.endereco}. O valor total é de R$ ${valorBRL}.`;
    const textLines = doc.splitTextToSize(textPrincipal, doc.internal.pageSize.getWidth() - 25);
    let startX = 25;
    let startY = 72;
    const lineSpacing = 7;

    // Desenhar cada linha
    textLines.forEach((line, index) => {
      if (index === 0) {
        doc.text(line, startX, startY);
      } else {
        doc.text(line, 15, startY);
      }
      startY += lineSpacing;
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Descrição do Serviço:", 62, 110);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    let yOffset = 120;
    descricaoServicos.forEach((item) => {
      if (item) {
        doc.text(`- ${item}`, 25, yOffset);
        yOffset += 7;
      }
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Apresentação Técnica", 62, 180);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("TÉCNICOS QUALIFICADOS PARA REALIZAR OS SERVIÇOS COM MAESTRIA. COM PRODUTOS DE QUALIDADE COMPROVADA. NOSSOS TÉCNICOS SÃO ESPECIALIZADOS E TÊM TODA A APARATOS PARA REALIZAR COM TOTAL CONFIANÇA E GARANTIA OS SERVIÇOS CONTRATADOS.", 15, 187, { maxWidth: 180 });

    doc.setFont("helvetica", "bold");
    doc.text("Condições Comerciais:", 15, 220);

    doc.setFont("helvetica", "normal");
    doc.text(`Valor:________________________________________________ ${valorBRL} reais`, 15, 227);

    const valorCartao = parseFloat(formData.valorCartao);
    const valorParcelas = valorCartao / parseInt(formData.parcelas);

    const valorParcelasBRL = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorParcelas);

    doc.text(`ou ${formData.parcelas}x de ${valorParcelasBRL} no cartão.`, 72, 234);


    doc.setFontSize(12);
    if (signatureData) {
      doc.text("P&F Dedetizadora", 140, 250);
      doc.addImage(signatureData, "PNG", 140, 250, 60, 20);
    }

    const dataEmissao = new Date().toLocaleDateString();
    doc.text(`Data de emissão: ${dataEmissao}`, 77, 288);

    const estabelecimentoNome = formData.estabelecimento
      ? formData.estabelecimento.replace(/\s+/g, "_") 
      : "Proposta";

    doc.save(`${estabelecimentoNome}_Proposta.pdf`);
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
      <Header title="3 Irmãos Proposta" />
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
    height: "100vh",
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
