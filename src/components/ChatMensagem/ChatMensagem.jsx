import styles from "./ChatMensagem.module.css";

function ChatMensagem({ autor, texto }) {
  const classeAutor = autor === "cliente" ? styles.cliente : styles.boardy;

  return <div className={`${styles.bolha} ${classeAutor}`}>{texto}</div>;
}

export default ChatMensagem;
