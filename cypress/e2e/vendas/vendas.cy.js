
describe('Histórico de vendas por categoria', () => {
  const categorias = [
    { id: 6, nome: 'Estratégia' },
    { id: 7, nome: 'Cartas' },
    { id: 8, nome: 'Cooperativos' },
  ];

  const resultadoVendas = {
    categorias: ['Estratégia', 'Cartas', 'Cooperativos'],
    pontos: [
      {
        periodo: '2026-01',
        valores: {
          Estratégia: 2789.10,
          Cartas: 359.60,
          Cooperativos: 999.30,
        },
      },
      {
        periodo: '2026-02',
        valores: {
          Estratégia: 709.70,
          Cartas: 559.20,
          Cooperativos: 99.90,
        },
      },
      {
        periodo: '2026-03',
        valores: {
          Estratégia: 1599.60,
          Cartas: 269.60,
          Cooperativos: 1349.20,
        },
      },
      {
        periodo: '2026-04',
        valores: {
          Estratégia: 2389.20,
          Cartas: 359.60,
          Cooperativos: 699.60,
        },
      },
      {
        periodo: '2026-05',
        valores: {
          Estratégia: 2309.30,
          Cartas: 649.10,
          Cooperativos: 399.60,
        },
      },
      {
        periodo: '2026-06',
        valores: {
          Estratégia: 399.90,
          Cartas: 179.70,
          Cooperativos: 1349.20,
        },
      },
    ],
  };

  beforeEach(() => {
    cy.intercept('GET', 'v1/categoria', {
      statusCode: 200,
      body: categorias,
    }).as('listarCategorias');

    cy.visit('http://localhost:5173/admin/vendas');

    cy.wait('@listarCategorias');
  });

  it('deve carregar as categorias disponíveis', () => {
    cy.get('[data-cy="vendas-categorias"]')
      .should('be.visible');

    categorias.forEach((categoria) => {
      cy.get(`[data-cy="vendas-categoria-${categoria.id}"]`)
        .should('exist');
    });
  });

  it('deve iniciar a consulta somente com período válido e categorias selecionadas', () => {
    cy.get('[data-cy="vendas-consultar"]')
      .should('be.disabled');

    cy.get('[data-cy="vendas-data-inicio"]')
      .type('2026-01-01');

    cy.get('[data-cy="vendas-consultar"]')
      .should('be.disabled');

    cy.get('[data-cy="vendas-data-fim"]')
      .type('2026-06-30');

    cy.get('[data-cy="vendas-consultar"]')
      .should('be.enabled');
  });

  it('deve impedir consulta quando a data final for anterior à inicial', () => {
    cy.get('[data-cy="vendas-data-inicio"]')
      .type('2026-06-30');

    cy.get('[data-cy="vendas-data-fim"]')
      .type('2026-01-01');

    cy.get('[data-cy="vendas-consultar"]')
      .should('be.disabled');
  });

  it('deve consultar o histórico de vendas por categoria', () => {
    cy.intercept('GET', '**v1/relatorios/vendas**', {
      statusCode: 200,
      body: resultadoVendas,
    }).as('consultarVendas');

    cy.get('[data-cy="vendas-data-inicio"]')
      .type('2026-01-01');

    cy.get('[data-cy="vendas-data-fim"]')
      .type('2026-06-30');

    cy.get('[data-cy="vendas-consultar"]')
      .click();

    cy.wait('@consultarVendas');

    cy.get('[data-cy="vendas-grafico"]')
      .should('be.visible');
  });

  it('deve permitir comparar duas ou mais categorias', () => {
    cy.get('[data-cy="vendas-categoria-6"]')
      .should('be.checked');

    cy.get('[data-cy="vendas-categoria-7"]')
      .should('be.checked');

    cy.get('[data-cy="vendas-categoria-8"]')
      .should('be.checked');

    cy.get('[data-cy="vendas-categoria-8"]')
      .uncheck();

    cy.get('[data-cy="vendas-categoria-6"]')
      .should('be.checked');

    cy.get('[data-cy="vendas-categoria-7"]')
      .should('be.checked');

    cy.get('[data-cy="vendas-categoria-8"]')
      .should('not.be.checked');
  });

  it('deve exibir mensagem quando ocorrer um erro na consulta', () => {
    cy.intercept('GET', '**v1/relatorios/vendas**', {
      statusCode: 500,
      body: {
        message: 'Erro ao consultar vendas.',
      },
    }).as('erroConsulta');

    cy.get('[data-cy="vendas-data-inicio"]')
      .type('2026-01-01');

    cy.get('[data-cy="vendas-data-fim"]')
      .type('2026-06-30');

    cy.get('[data-cy="vendas-consultar"]')
      .click();

    cy.wait('@erroConsulta');

    cy.contains('Erro ao consultar vendas.')
      .should('be.visible');
  });

  it('deve atualizar o gráfico ao alterar o período consultado', () => {
    cy.intercept('GET', '**v1/relatorios/vendas**', (req) => {
      const inicio = req.query.inicio;

      if (inicio === '2026-01-01') {
        req.reply({
          statusCode: 200,
          body: resultadoVendas,
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            categorias: ['Estratégia'],
            pontos: [
              {
                periodo: '2026-03',
                valores: {
                  Estratégia: 1599.60,
                },
              },
            ],
          },
        });
      }
    }).as('consultarPorPeriodo');

    cy.get('[data-cy="vendas-data-inicio"]')
      .type('2026-01-01');

    cy.get('[data-cy="vendas-data-fim"]')
      .type('2026-06-30');

    cy.get('[data-cy="vendas-consultar"]')
      .click();

    cy.wait('@consultarPorPeriodo');

    cy.get('[data-cy="vendas-data-inicio"]')
      .clear()
      .type('2026-03-01');

    cy.get('[data-cy="vendas-consultar"]')
      .click();

    cy.wait('@consultarPorPeriodo');
  });

  it('deve responder em menos de 1 segundo ao consultar o histórico de vendas', () => {
    cy.intercept('GET', '**/v1/relatorios/vendas**', {
      statusCode: 200,
      body: resultadoVendas,
    }).as('consultaRapida');

    cy.get('[data-cy="vendas-data-inicio"]')
      .type('2026-01-01');

    cy.get('[data-cy="vendas-data-fim"]')
      .type('2026-06-30');

    let tempoInicio;

    cy.get('[data-cy="vendas-consultar"]')
      .click()
      .then(() => {
        tempoInicio = Date.now();
      });

    cy.wait('@consultaRapida').then(() => {
      const tempoTotal = Date.now() - tempoInicio;
      expect(tempoTotal).to.be.lessThan(1000);
    });
  });
});
