Cypress.Commands.add("preencherFormularioCliente", (cliente) => {
  if (cliente.nome !== undefined) {
    cy.get('[data-cy="cliente-nome"]').clear().type(cliente.nome);
  }

  if (cliente.genero !== undefined) {
    cy.get('[data-cy="cliente-genero"]').select(cliente.genero);
  }

  if (cliente.dataNascimento !== undefined) {
    cy.get('[data-cy="cliente-data-nascimento"]').clear().type(cliente.dataNascimento);
  }

  if (cliente.cpf !== undefined) {
    cy.get('[data-cy="cliente-cpf"]').clear().type(cliente.cpf);
  }

  if (cliente.email !== undefined) {
    cy.get('[data-cy="cliente-email"]').clear().type(cliente.email);
  }

  if (cliente.senha !== undefined) {
    cy.get('[data-cy="cliente-senha"]').clear().type(cliente.senha);
    cy.get('[data-cy="cliente-confirmar-senha"]').clear().type(cliente.senha);
  }
});
