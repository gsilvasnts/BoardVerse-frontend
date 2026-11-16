import { useState } from "react";
import styles from "./Gallery.module.css";

function Gallery({ imagens, nome }) {
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  return (
    <div className={styles.galeria}>
      <div className={styles.miniaturas}>
        {imagens.map((imagem, indice) => (
          <button
            key={indice}
            type="button"
            className={`${styles.miniatura} ${indice === indiceAtivo ? styles.ativa : ""}`}
            onClick={() => setIndiceAtivo(indice)}
            aria-label={`Ver imagem ${indice + 1} de ${nome}`}
          >
            <img src={imagem} alt="" className={styles.miniaturaImagem} />
          </button>
        ))}
      </div>

      <div className={styles.principal}>
        <img
          src={imagens[indiceAtivo]}
          alt={nome}
          className={styles.principalImagem}
        />
      </div>
    </div>
  );
}

export default Gallery;
