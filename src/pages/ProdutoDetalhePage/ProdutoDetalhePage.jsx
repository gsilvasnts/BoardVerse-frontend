import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Gallery from "../../components/Gallery/Gallery";
import RecommendedProduct from "../../components/RecommendedProduct/RecommendedProduct";
import { formatarPreco } from "../../utils/formatarPreco";
import skullKingImg from "../../assets/images/skull-king.jpg";
import unoImg from "../../assets/images/uno.jpg";
import catanImg from "../../assets/images/catan.jpg";
import styles from "./ProdutoDetalhePage.module.css";

const PRODUTOS_MOCK = [
  {
    id: 1,
    nome: "Skull King",
    fabricante: "Devir",
    preco: 15,
    descricao:
      "Neste emocionante jogo de cartas, repleto de piratas, sereias e monstros marinhos, apenas o capitão mais audacioso conseguirá a vitória. Supere seus rivais, preveja suas vitórias e assuma como o único Skull King!",
    imagens: [skullKingImg, skullKingImg, skullKingImg, skullKingImg],
  },
  {
    id: 2,
    nome: "UNO",
    fabricante: "Mattel",
    preco: 12.99,
    descricao: "Combine cores e números, na esperança de gritar UNO!",
    imagens: [unoImg],
  },
  {
    id: 3,
    nome: "Catan",
    fabricante: "Devir",
    preco: 25.9,
    descricao:
      "Negocie, construa e colonize esta ilha em um mundo de aventura estratégico.",
    imagens: [catanImg],
  },
];

function ProdutoDetalhePage() {
  const { id } = useParams();
  const produto = PRODUTOS_MOCK.find((item) => item.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  function handleAdicionarAoCarrinho() {
    console.log("Adicionado ao carrinho:", produto);
  }

  if (!produto) {
    return (
      <div className={styles.page}>
        <p className={styles.naoEncontrado}>Produto não encontrado.</p>
      </div>
    );
  }

  const recomendados = PRODUTOS_MOCK.filter(
    (item) => item.id !== produto.id,
  ).slice(0, 3);

  return (
    <div className={styles.page}>
      <section className={styles.detalhe}>
        <Gallery
          key={produto.id}
          imagens={produto.imagens}
          nome={produto.nome}
        />

        <div className={styles.info}>
          <h1 className={styles.nome}>{produto.nome}</h1>
          <p className={styles.fabricante}>
            Produzido por {produto.fabricante}
          </p>
          <span className={styles.preco}>{formatarPreco(produto.preco)}</span>
          <p className={styles.descricao}>{produto.descricao}</p>

          <div className={styles.acao}>
            <Button
              data-cy="produto-adicionar-carrinho"
              variante="primary"
              onClick={handleAdicionarAoCarrinho}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.recomendados}>
        <h2 className={styles.tituloSecao}>Produtos que você pode gostar</h2>

        <div className={styles.listaRecomendados}>
          {recomendados.map((item) => (
            <RecommendedProduct
              key={item.id}
              id={item.id}
              imagem={item.imagens[0]}
              nome={item.nome}
              descricao={item.descricao}
              preco={item.preco}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProdutoDetalhePage;
