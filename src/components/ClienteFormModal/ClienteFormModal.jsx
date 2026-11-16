import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Input from "../Input/Input";
import Select from "../Select/Select";
import Button from "../Button/Button";
import styles from "./ClienteFormModal.module.css";

const OPCOES_GENERO = [
  { valor: "MASCULINO", rotulo: "Masculino" },
  { valor: "FEMININO", rotulo: "Feminino" },
  { valor: "OUTRO", rotulo: "Outro" },
];

function ClienteFormModal({
  aberto,
  onFechar,
  onSalvar,
  clienteInicial,
  erros = {},
  erroOperacao,
}) {
  const [nome, setNome] = useState("");
  const [genero, setGenero] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [erroConfirmacao, setErroConfirmacao] = useState(null);

  const OPCOES_STATUS = [
    { valor: "true", rotulo: "Ativo" },
    { valor: "false", rotulo: "Inativo" },
  ];

  useEffect(() => {
    if (clienteInicial) {
      setNome(clienteInicial.nome ?? "");
      setGenero(clienteInicial.genero ?? "");
      setDataNascimento(clienteInicial.dataNascimento ?? "");
      setCpf(clienteInicial.cpf ?? "");
      setEmail(clienteInicial.email ?? "");
      setAtivo(clienteInicial.ativo ?? true);

      setSenha("");
      setConfirmarSenha("");
    } else {
      limparFormulario();
    }
  }, [clienteInicial]);

  function limparFormulario() {
    setNome("");
    setGenero("");
    setDataNascimento("");
    setCpf("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
    setAtivo(true);
    setErroConfirmacao(null);
  }

  function handleFechar() {
    limparFormulario();
    onFechar();
  }

  function handleSalvar() {
    if (senha !== confirmarSenha) {
      setErroConfirmacao("As senhas não coincidem.");
      return;
    }

    setErroConfirmacao(null);

    onSalvar({
      nome,
      genero: genero || null,
      dataNascimento,
      cpf: cpf.replace(/\D/g, ""),
      email,
      ativo,
      senha: senha || null,
    });
  }

  return (
    <Modal
      data-cy="cliente-modal"
      aberto={aberto}
      onFechar={handleFechar}
      titulo={clienteInicial ? "Editar Cliente" : "Cadastrar Cliente"}
    >
      <h4 className={styles.sectionTitle}>Informações pessoais</h4>

      <div className={styles.row}>
        <div className={styles.field}>
          <Input
            data-cy="cliente-nome"
            label="Nome"
            valor={nome}
            onChange={(e) => setNome(e.target.value)}
            obrigatorio
          />
          {erros.nome && <p className={styles.erroCampo}>{erros.nome}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Gênero<span className={styles.required}> *</span>
          </label>
          <Select
            data-cy="cliente-genero"
            valor={genero}
            onChange={(e) => setGenero(e.target.value)}
            opcoes={OPCOES_GENERO}
            placeholder="Selecionar"
          />
          {erros.genero && <p className={styles.erroCampo}>{erros.genero}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Input
            data-cy="cliente-data-nascimento"
            label="Data de nascimento"
            tipo="date"
            valor={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            obrigatorio
          />
          {erros.dataNascimento && (
            <p className={styles.erroCampo}>{erros.dataNascimento}</p>
          )}
        </div>

        <div className={styles.field}>
          <Input
            data-cy="cliente-cpf"
            label="CPF"
            valor={cpf}
            onChange={(e) => setCpf(e.target.value)}
            obrigatorio
          />
          {erros.cpf && <p className={styles.erroCampo}>{erros.cpf}</p>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <Input
            data-cy="cliente-email"
            label="Email"
            tipo="email"
            valor={email}
            onChange={(e) => setEmail(e.target.value)}
            obrigatorio
          />
          {erros.email && <p className={styles.erroCampo}>{erros.email}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Status<span className={styles.required}> *</span>
          </label>
          <Select
            data-cy="cliente-status"
            valor={ativo.toString()}
            onChange={(e) => setAtivo(e.target.value === "true")}
            opcoes={OPCOES_STATUS}
            placeholder="Selecionar"
          />
          {erros.ativo && <p className={styles.erroCampo}>{erros.ativo}</p>}
        </div>
      </div>

      {!clienteInicial && (
        <>
          <h4 className={styles.sectionTitle}>Acesso</h4>

          <div className={styles.row}>
            <div className={styles.field}>
              <Input
                data-cy="cliente-senha"
                label="Senha"
                tipo="password"
                valor={senha}
                onChange={(e) => setSenha(e.target.value)}
                obrigatorio
              />

              {erros.senha && <p className={styles.erroCampo}>{erros.senha}</p>}
            </div>

            <div className={styles.field}>
              <Input
                data-cy="cliente-confirmar-senha"
                label="Confirmar senha"
                tipo="password"
                valor={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                obrigatorio
              />
            </div>
          </div>

          {erroConfirmacao && (
            <p className={styles.erroCampo}>{erroConfirmacao}</p>
          )}
        </>
      )}

      {erroOperacao && (
        <p className={styles.erroCampo}>
          {erroOperacao}
        </p>
      )}

      <Button
        data-cy="cliente-salvar"
        variante="primary"
        onClick={handleSalvar}
      >
        Salvar cliente
      </Button>
    </Modal>
  );
}

export default ClienteFormModal;
