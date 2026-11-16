// components/Chatbot/Chatbot.jsx
import { useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatJanela from "../ChatJanela/ChatJanela";
import { chatbotService } from "../../services/chatbotService";
import styles from "./Chatbot.module.css";

const MENSAGEM_INICIAL = {
  id: 0,
  autor: "boardy",
  texto:
    "Olá! Eu sou o Boardy. Posso te ajudar a encontrar o próximo jogo da sua mesa. Sobre o que você quer conversar?",
};

function Chatbot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([MENSAGEM_INICIAL]);
  const [enviando, setEnviando] = useState(false);
  const proximoId = useRef(1);

  function adicionarMensagem(autor, texto) {
    const mensagem = { id: proximoId.current++, autor, texto };
    setMensagens((atual) => [...atual, mensagem]);
  }

  async function handleEnviar(texto) {
    adicionarMensagem("cliente", texto);
    setEnviando(true);

    try {
      const { resposta } = await chatbotService.enviar(texto);
      adicionarMensagem("boardy", resposta);
    } catch (erro) {
      console.error(erro);
      adicionarMensagem(
        "boardy",
        "Não consegui responder agora. Tente novamente em instantes.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {aberto && (
        <ChatJanela
          mensagens={mensagens}
          enviando={enviando}
          onEnviar={handleEnviar}
          onFechar={() => setAberto(false)}
        />
      )}

      {!aberto && (
        <button
          type="button"
          data-cy="chatbot-abrir"
          className={styles.botao}
          onClick={() => setAberto(true)}
        >
          Precisa de ajuda? Chame o Boardy!
          <MessageCircle size={18} />
        </button>
      )}
    </>
  );
}

export default Chatbot;
