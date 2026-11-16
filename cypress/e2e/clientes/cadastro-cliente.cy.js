describe("Cadastro de cliente", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/admin/clientes");
  });
  it("deve abrir o formulário de cadastro ao clicar no botão", () => {
    cy.get('[data-cy="cliente-cadastrar"]').click();
    cy.contains("Cadastrar cliente").should("be.visible");
    cy.get('[data-cy="cliente-nome"]').should("be.visible");
    cy.get('[data-cy="cliente-cpf"]').should("be.visible");
    cy.get('[data-cy="cliente-email"]').should("be.visible");
    cy.get('[data-cy="cliente-senha"]').should("be.visible");
  });

  it("deve exibir erro quando o nome não é preenchido", () => {
    cy.fixture("clientes").then(({ clienteValido }) => {
      const { nome, ...clienteSemNome } = clienteValido;
      cy.get('[data-cy="cliente-cadastrar"]').click();
      cy.preencherFormularioCliente(clienteSemNome);
      cy.get('[data-cy="cliente-salvar"]').click();
      cy.contains("O nome é obrigatório").should("be.visible");
    });
  });

  it("deve exibir erro quando o CPF é inválido", () => {
    cy.fixture("clientes").then(({ clienteValido }) => {
      const clienteComCpfInvalido = { ...clienteValido, cpf: "12345678900" };
      cy.get('[data-cy="cliente-cadastrar"]').click();
      cy.preencherFormularioCliente(clienteComCpfInvalido);
      cy.get('[data-cy="cliente-salvar"]').click();
      cy.contains("O CPF digitado é inválido").should("be.visible");
    });
  });

  it("deve exibir erro quando o e-mail não é preenchido", () => {
    cy.fixture("clientes").then(({ clienteValido }) => {
      const { email, ...clienteSemEmail } = clienteValido;
      cy.get('[data-cy="cliente-cadastrar"]').click();
      cy.preencherFormularioCliente(clienteSemEmail);
      cy.get('[data-cy="cliente-salvar"]').click();
      cy.contains("O e-mail é obrigatório").should("be.visible");
    });
  });

  it("deve exibir erro quando o e-mail tem formato inválido", () => {
    cy.fixture("clientes").then(({ clienteValido }) => {
      const clienteComEmailInvalido = {
        ...clienteValido,
        email: "email-sem-arroba",
      };
      cy.get('[data-cy="cliente-cadastrar"]').click();
      cy.preencherFormularioCliente(clienteComEmailInvalido);
      cy.get('[data-cy="cliente-salvar"]').click();
      cy.contains("O e-mail digitado é inválido").should("be.visible");
    });
  });
  
  it("deve exibir erro quando as senhas não coincidem", () => {
    cy.fixture("clientes").then(({ clienteValido }) => {
      cy.get('[data-cy="cliente-cadastrar"]').click();
      cy.preencherFormularioCliente({ ...clienteValido, senha: undefined });
      cy.get('[data-cy="cliente-senha"]').type("Senha@123");
      cy.get('[data-cy="cliente-confirmar-senha"]').type("Senha@456");
      cy.get('[data-cy="cliente-salvar"]').click();
      cy.contains("As senhas não coincidem").should("be.visible");
    });
  });
});
