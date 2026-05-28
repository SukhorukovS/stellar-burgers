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

describe('Ingredient Modal', () => {
  const ingredient = ingredidentsData[0];

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should open ingredient modal when clicking on ingredient', () => {
    cy.get(`[data-cy=ingredient-${ingredient._id}]`).find('a').click();

    cy.contains('Детали ингредиента').should('exist');
    cy.contains(ingredient.name).should('exist');
    cy.contains(String(ingredient.calories)).should('exist');
    cy.contains(String(ingredient.proteins)).should('exist');
    cy.contains(String(ingredient.fat)).should('exist');
    cy.contains(String(ingredient.carbohydrates)).should('exist');
    cy.url().should(
      'eq',
      `${Cypress.config('baseUrl')}/ingredients/${ingredient._id}`
    );
  });

  it('should close modal when clicking the close button', () => {
    cy.get(`[data-cy=ingredient-${ingredient._id}]`).find('a').click();

    cy.contains('Детали ингредиента').should('exist');

    cy.get('[data-cy=modal-close]').click();

    cy.contains('Детали ингредиента').should('not.exist');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });

  it('should close modal when clicking the overlay', () => {
    cy.get(`[data-cy=ingredient-${ingredient._id}]`).find('a').click();

    cy.contains('Детали ингредиента').should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });

    cy.contains('Детали ингредиента').should('not.exist');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });
});
