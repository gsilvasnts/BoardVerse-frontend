import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import ChatMensagem from "../ChatMensagem/ChatMensagem";
import styles from "./ChatJanela.module.css";

function ChatJanela({ mensagens, enviando, onEnviar, onFechar }) {
  const [texto, setTexto] = useState("");
  const fimDaLista = useRef(null);

  useEffect(() => {
    fimDaLista.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, enviando]);

  function handleSubmit(evento) {
    evento.preventDefault();

    const textoLimpo = texto.trim();
    if (!textoLimpo || enviando) return;

    onEnviar(textoLimpo);
    setTexto("");
  }

  return (
    <section
      className={styles.janela}
      role="dialog"
      aria-label="Chat com o Boardy"
    >
      <header className={styles.cabecalho}>
        <h2 className={styles.titulo}>Boardy</h2>
        <button
          type="button"
          data-cy="chatbot-fechar"
          className={styles.fechar}
          onClick={onFechar}
          aria-label="Fechar chat"
        >
          <X size={18} />
        </button>
      </header>

      <div className={styles.mensagens} data-cy="chatbot-mensagens">
        {mensagens.map((mensagem) => (
          <ChatMensagem
            key={mensagem.id}
            autor={mensagem.autor}
            texto={mensagem.texto}
          />
        ))}

        {enviando && (
          <p className={styles.digitando}>Boardy está digitando...</p>
        )}

        <div ref={fimDaLista} />
      </div>

      <form className={styles.formulario} onSubmit={handleSubmit}>
        <input
          type="text"
          data-cy="chatbot-entrada"
          className={styles.entrada}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          autoFocus
        />
        <button
          type="submit"
          data-cy="chatbot-enviar"
          className={styles.enviar}
          disabled={!texto.trim() || enviando}
          aria-label="Enviar mensagem"
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

export default ChatJanela;
