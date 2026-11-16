import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import SalesChart from "../../components/SalesChart/SalesChart";
import { categoriaService } from "../../services/categoriaService";
import { vendasService } from "../../services/vendasService";
import styles from "./SalesPage.module.css";

const PALETA = [
  "#7c4dff",
  "#4dd8d8",
  "#f4867a",
  "#ffb057",
  "#6fcf97",
  "#f2c94c",
];

const CATEGORIAS_GRAFICO = ["Tabuleiros", "Cartas", "Dados", "Família"];

function formatarPeriodo(periodo) {
  const [ano, mes] = periodo.split("-");
  return `${mes}/${ano}`;
}

function SalesPage() {
  const [categorias, setCategorias] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    categoriaService
      .listar()
      .then((lista) => {
        setCategorias(lista);
        setSelecionadas(lista.map((c) => c.id));
      })
      .catch(() => setErro("Não foi possível carregar as categorias."));
  }, []);

  const cores = Object.fromEntries(
    categorias.map((c, i) => [c.id, PALETA[i % PALETA.length]]),
  );

  const periodoInvalido = dataInicio && dataFim && dataFim < dataInicio;

  const podeConsultar =
    dataInicio &&
    dataFim &&
    !periodoInvalido &&
    selecionadas.length > 0 &&
    !carregando;

  function alternarCategoria(id) {
    setSelecionadas((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id],
    );
  }

  async function handleConsultar() {
    try {
      setCarregando(true);
      setErro(null);
      setResultado(
        await vendasService.consultar({
          inicio: dataInicio,
          fim: dataFim,
          categorias: selecionadas,
        }),
      );
    } catch (e) {
      setResultado(null);
      setErro(
        e.response?.status === 403
          ? "Acesso restrito ao administrador."
          : (e.response?.data?.message ??
              "Não foi possível consultar as vendas."),
      );
      console.log(e);
    } finally {
      setCarregando(false);
    }
  }

  const dadosGrafico = resultado?.pontos.map((p) => ({
    periodo: formatarPeriodo(p.periodo),
    ...p.valores,
  }));

  const categoriasNoGrafico = categorias.filter((c) =>
    resultado?.categorias.includes(c.nome),
  );

  function handleExportarGrafico() {
    console.log("Exportando gráfico...", {
      categoria,
      dataDe,
      dataAte,
      exibicao,
    });
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Histórico De Vendas</h1>

      <div className={styles.card}>
        <div className={styles.filtersRow}>
          <div className={styles.field}>
            <label className={styles.label}>De</label>
            <Input
              data-cy="vendas-data-inicio"
              tipo="date"
              valor={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Até</label>
            <Input
              data-cy="vendas-data-fim"
              tipo="date"
              valor={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        {periodoInvalido && (
          <p className={styles.erroCampo}>
            A data de fim não pode ser anterior à data de início.
          </p>
        )}

        <div className={styles.categorias} data-cy="vendas-categorias">
          {categorias.map((c) => (
            <label key={c.id} className={styles.categoriaOpcao}>
              <input
                type="checkbox"
                data-cy={`vendas-categoria-${c.id}`}
                checked={selecionadas.includes(c.id)}
                onChange={() => alternarCategoria(c.id)}
              />
              <span
                className={styles.marcador}
                style={{ background: cores[c.id] }}
              />
              {c.nome}
            </label>
          ))}
        </div>

        <Button
          data-cy="vendas-consultar"
          variante="primary"
          disabled={!podeConsultar}
          onClick={handleConsultar}
        >
          Consultar
        </Button>

        {erro && <p className={styles.erroCampo}>{erro}</p>}
        {carregando && <p>Carregando...</p>}

        {resultado && (
          <div data-cy="vendas-grafico">
            <SalesChart
              dados={dadosGrafico}
              categorias={categoriasNoGrafico}
              cores={cores}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesPage;
