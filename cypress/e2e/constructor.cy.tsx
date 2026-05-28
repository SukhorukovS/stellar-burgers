import ingredidents from '../fixtures/ingredients.json';

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

  it('successfully loads', () => {
    cy.get('@getIngredients').its('response.statusCode').should('eq', 200);
  });

  it('displays ingredients from mocked data', () => {
    cy.contains('Краторная булка N-200i').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    cy.contains('Соус Spicy-X').should('exist');
  });

  it('could add ingredient to constructor', () => {
    const bunElement = cy.get(`[data-cy=ingredient-${bun._id}]`);
    const addButtonBunElement = bunElement.find('button');

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

describe('Order Creation', () => {
  const bun = ingredidentsData.find((ingredient) => ingredient.type === 'bun')!;
  const mainIngredient = ingredidentsData.find(
    (ingredient) => ingredient.type === 'main'
  )!;

  const mockOrder = {
    success: true,
    name: 'Краторный бургер',
    order: {
      _id: '643d69a5c3f7b9001cfa0999',
      status: 'done',
      name: 'Краторный бургер',
      owner: {
        name: 'TestUser',
        email: 'testuser@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 12345,
      price: 2510,
      ingredients: [bun._id, mainIngredient._id, bun._id]
    }
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('should create an order and show order number in modal', () => {
    cy.get(`[data-cy=ingredient-${bun._id}]`).find('button').click();

    cy.get(`[data-cy=ingredient-${mainIngredient._id}]`).find('button').click();

    cy.get('[data-cy=burger-constructor]').should('contain', bun.name);
    cy.get('[data-cy=burger-constructor]').should(
      'contain',
      mainIngredient.name
    );

    cy.contains('button', 'Оформить заказ').click();

    cy.wait('@createOrder');

    cy.contains(String(mockOrder.order.number)).should('exist');
    cy.contains('идентификатор заказа').should('exist');

    cy.get('[data-cy=burger-constructor]').should('contain', 'Выберите булки');
    cy.get('[data-cy=burger-constructor]').should(
      'contain',
      'Выберите начинку'
    );

    cy.get('[data-cy=modal-close]').click();

    cy.contains('идентификатор заказа').should('not.exist');
  });
});
