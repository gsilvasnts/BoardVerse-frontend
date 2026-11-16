describe("Listagem de clientes", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/admin/clientes");
  });
  
  it("deve exibir a tabela de clientes ao carregar a página", () => {
    cy.contains("Carregando clientes...").should("be.visible");
    cy.contains("Carregando clientes...").should("not.exist");
    cy.get("table").should("be.visible");
    cy.get("table thead th").should("contain", "Nome");
    cy.get("table thead th").should("contain", "E-mail");
    cy.get("table thead th").should("contain", "Status");
  });

  it("deve exibir mensagem de erro se a API falhar", () => {
    cy.intercept("GET", "**/v1/cliente", { forceNetworkError: true }).as(
      "erroListagem",
    );
    cy.visit("http://localhost:5173/admin/clientes");
    cy.wait("@erroListagem");
    cy.contains("Não foi possível carregar os clientes.").should("be.visible");
  });
});
