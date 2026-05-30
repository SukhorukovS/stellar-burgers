import ingredidents from '../fixtures/ingredients.json';
import mockOrder from '../fixtures/order.json';

const ingredidentsData = ingredidents.data;

describe('Constructor Page', () => {
  const bun = ingredidentsData.find((ingredient) => ingredient.type === 'bun')!;
  const mainIngredient = ingredidentsData.find(
    (ingredient) => ingredient.type === 'main'
  )!;
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Main functionality', () => {
    it('successfully loads', () => {
      cy.get('@getIngredients').its('response.statusCode').should('eq', 200);
    });

    it('displays ingredients from mocked data', () => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('Соус Spicy-X').should('exist');
    });

    it('could add ingredient to constructor', () => {
      cy.get(`[data-cy=ingredient-${bun._id}]`)
        .find('button')
        .as('addBunButton');

      cy.get(`[data-cy=ingredient-${mainIngredient._id}]`)
        .find('button')
        .as('addButtonMain');

      cy.get('@addBunButton').click();

      cy.get('[data-cy=burger-constructor]').as('burgerConstructor');

      cy.get('@burgerConstructor').should('not.contain', 'Выберите булки');

      cy.get('@addButtonMain').click();

      cy.get('@burgerConstructor').should('not.contain', 'Выберите начинку');

      cy.get('@burgerConstructor').should('contain', bun.name);
      cy.get('@burgerConstructor').should('contain', mainIngredient.name);
    });
  });

  describe('Ingredient Modal', () => {
    const ingredient = ingredidentsData[0];

    it('should open ingredient modal when clicking on ingredient', () => {
      cy.get('#modals').as('modals');
      cy.get(`[data-cy=ingredient-${ingredient._id}]`).find('a').click();

      cy.get('@modals').should('contain', 'Детали ингредиента');
      cy.get('@modals').should('contain', ingredient.name);
      cy.get('@modals').should('contain', String(ingredient.calories));
      cy.get('@modals').should('contain', String(ingredient.proteins));
      cy.get('@modals').should('contain', String(ingredient.fat));
      cy.get('@modals').should('contain', String(ingredient.carbohydrates));
      cy.url().should(
        'eq',
        `${Cypress.config('baseUrl')}/ingredients/${ingredient._id}`
      );
    });

    it('should close modal when clicking the close button', () => {
      cy.get('#modals').as('modals');
      cy.get(`[data-cy=ingredient-${ingredient._id}]`).find('a').click();

      cy.get('@modals').should('contain', 'Детали ингредиента');

      cy.get('[data-cy=modal-close]').click();

      cy.get('@modals').should('be.empty');
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    });

    it('should close modal when clicking the overlay', () => {
      cy.get('#modals').as('modals');
      cy.get(`[data-cy=ingredient-${ingredient._id}]`).find('a').click();

      cy.get('@modals').should('contain', 'Детали ингредиента');
      cy.get('[data-cy=modal-overlay]').click({ force: true });

      cy.get('@modals').should('be.empty');
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    });
  });

  describe('Order Creation', () => {
    const bun = ingredidentsData.find(
      (ingredient) => ingredient.type === 'bun'
    )!;
    const mainIngredient = ingredidentsData.find(
      (ingredient) => ingredient.type === 'main'
    )!;

    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('refreshToken', 'mock-refresh-token');
        }
      });

      cy.setCookie('accessToken', 'mock-access-token');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.clearLocalStorage('refreshToken');
    });

    it('should create an order and show order number in modal', () => {
      cy.wait('@getUser');

      cy.get(`[data-cy=ingredient-${bun._id}]`).find('button').click();

      cy.get(`[data-cy=ingredient-${mainIngredient._id}]`)
        .find('button')
        .click();

      cy.get('[data-cy=burger-constructor]').should('contain', bun.name);
      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        mainIngredient.name
      );

      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get('#modals [data-cy=order-details]').as('orderDetail');

      cy.get('@orderDetail').should('contain', String(mockOrder.order.number));
      cy.get('@orderDetail').should('contain', 'идентификатор заказа');

      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        'Выберите булки'
      );
      cy.get('[data-cy=burger-constructor]').should(
        'contain',
        'Выберите начинку'
      );

      cy.get('[data-cy=modal-close]').click();

      cy.get('@orderDetail').should('not.exist');
    });
  });
});
