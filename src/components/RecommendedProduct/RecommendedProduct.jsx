import { Link } from "react-router-dom";
import { formatarPreco } from "../../utils/formatarPreco";
import styles from "./RecommendedProduct.module.css";

function RecommendedProduct({ id, imagem, nome, descricao, preco }) {
  return (
    <Link to={`/produto/${id}`} className={styles.card}>
      <div className={styles.imagemWrapper}>
        <img src={imagem} alt={nome} className={styles.imagem} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.nome}>{nome}</h3>
        <p className={styles.descricao}>{descricao}</p>
        <span className={styles.preco}>{formatarPreco(preco)}</span>
      </div>
    </Link>
  );
}

export default RecommendedProduct;
