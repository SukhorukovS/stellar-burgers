import ingredidents from '../fixtures/ingredients.json';

const ingredidentsData = ingredidents.data;

describe('Constructor Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('successfully loads', () => {
    cy.get('@getIngredients').its('response.statusCode').should('eq', 200);
  });

  it('displays ingredients from mocked data', () => {
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.contains('Соус Spicy-X').should('exist');
  });

  it('could add ingredient to constructor', () => {
    const bun = ingredidentsData.find(
      (ingredient) => ingredient.type === 'bun'
    )!;
    const bunElement = cy.get(`[data-cy=ingredient-${bun._id}]`);
    const addButtonBunElement = bunElement.find('button');

    const mainIngredient = ingredidentsData.find(
      (ingredient) => ingredient.type === 'main'
    )!;
    const mainElement = cy.get(`[data-cy=ingredient-${mainIngredient._id}]`);
    const addButtonMainElement = mainElement.find('button');

    addButtonBunElement.click();

    cy.contains('Выберите булки').should('not.exist');

    addButtonMainElement.click();

    cy.contains('Выберите начинку').should('not.exist');

    const burgerConstructorElement = cy.get('[data-cy=burger-constructor]');
    burgerConstructorElement.should('contain', bun.name);
    burgerConstructorElement.should('contain', mainIngredient.name);
  });
});
