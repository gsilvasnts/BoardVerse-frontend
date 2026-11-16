import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Info } from "lucide-react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import ClienteFormModal from "../../components/ClienteFormModal/ClienteFormModal";
import styles from "./ClientesPage.module.css";
import { clienteService } from "../../services/clienteService";

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [erroOperacao, setErroOperacao] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);
  const [errosCadastro, setErrosCadastro] = useState({});

  const [nomeFiltro, setNomeFiltro] = useState("");
  const [cpfFiltro, setCpfFiltro] = useState("");
  const [emailFiltro, setEmailFiltro] = useState("");

  async function carregarClientes() {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await clienteService.listar();
      setClientes(dados);
    } catch (erroRequisicao) {
      setErro("Não foi possível carregar os clientes.");
      console.error(erroRequisicao);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function handleAbrirCadastro() {
    setClienteEmEdicao(null);
    setErrosCadastro({});
    setErroOperacao(null);
    setModalAberto(true);
  }

  function handleAbrirEdicao(cliente) {
    setClienteEmEdicao(cliente);
    setErrosCadastro({});
    setModalAberto(true);
  }

  function handleFecharModal() {
    setModalAberto(false);
    setClienteEmEdicao(null);
    setErrosCadastro({});
    setErroOperacao(null);
  }

  async function handleSalvarCliente(dadosCliente) {
    try {
      setErrosCadastro({});
      setErroOperacao(null);

      if (clienteEmEdicao) {
        await clienteService.atualizar(
          clienteEmEdicao.id,
          dadosCliente
        );
      } else {
        await clienteService.cadastrar(dadosCliente);
      }

      handleFecharModal();
      await carregarClientes();

    } catch (erroRequisicao) {
      const dadosErro = erroRequisicao.response?.data;

      if (dadosErro?.errors) {
        setErrosCadastro(dadosErro.errors);
      } else {
        setErroOperacao(
          dadosErro?.message ?? "Erro ao salvar cliente."
        );
      }
    }
  }

  async function handleExcluir(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja inativar este cliente?",
    );
    if (!confirmar) return;

    try {
      await clienteService.inativar(id);
      await carregarClientes();
    } catch (erroRequisicao) {
      setErroOperacao("Erro ao inativar cliente.");
      console.error(erroRequisicao);
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const bateNome = cliente.nome
      .toLowerCase()
      .includes(nomeFiltro.toLowerCase());
    const bateCpf = cliente.cpf.includes(cpfFiltro);
    const bateEmail = (cliente.email ?? "")
      .toLowerCase()
      .includes(emailFiltro.toLowerCase());
    return bateNome && bateCpf && bateEmail;
  });

  function limparFiltro() {
    setNomeFiltro("");
    setCpfFiltro("");
    setEmailFiltro("");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clientes</h1>
        <Button data-cy="cliente-cadastrar" variante="primary" onClick={handleAbrirCadastro}>
          <Plus size={16} />
          Cadastrar cliente
        </Button>
      </div>

      <div className={styles.filters}>
        <span className={styles.filterLabel}>Filtrar por:</span>

        <div className={styles.filterRow}>
          <Input
            label="Nome"
            valor={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
          />
          <Input
            label="CPF"
            valor={cpfFiltro}
            onChange={(e) => setCpfFiltro(e.target.value)}
          />
          <Input
            label="E-mail"
            tipo="email"
            valor={emailFiltro}
            onChange={(e) => setEmailFiltro(e.target.value)}
          />
        </div>

        <div className={styles.filterActions}>
          <Button variante="primary">Pesquisar</Button>
          <Button variante="secondary" onClick={limparFiltro}>
            Limpar
          </Button>
        </div>
      </div>

      {carregando && <p>Carregando clientes...</p>}
      {erro && <p className={styles.erro}>{erro}</p>}

      {!carregando && !erro && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <div className={styles.avatar} />
                </td>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      cliente.ativo ? styles.statusAtivo : styles.statusInativo
                    }`}
                  >
                    {cliente.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconButton}
                      aria-label="Editar"
                      onClick={() => handleAbrirEdicao(cliente)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className={styles.iconButton}
                      aria-label="Excluir"
                      onClick={() => handleExcluir(cliente.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className={styles.iconButton} aria-label="Detalhes">
                      <Info size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ClienteFormModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        onSalvar={handleSalvarCliente}
        erros={errosCadastro}
        erroOperacao={erroOperacao}
        clienteInicial={clienteEmEdicao}
      />
    </div>
  );
}

export default ClientesPage;
