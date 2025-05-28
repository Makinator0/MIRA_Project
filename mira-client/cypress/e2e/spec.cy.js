import { faker } from '@faker-js/faker';

const API_URL = 'http://localhost:8080';

describe('API подготовка данных и тесты', () => {
  let testUserToken;
  let digitalUserToken;

  before(() => {
    // Регистрация тестового пользователя через API
    const testUser = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email(),
      numberPhone: faker.phone.number('+1 (###) ###-####'),
      password: faker.internet.password({ length: 10 }),
      role: 'Developer', // Якщо потрібно рандомно — скажеш
      project: 'CORE'    // Якщо потрібно рандомно — скажеш
    };

    cy.request({
      method: 'POST',
      url: `${API_URL}/registration`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: testUser
    }).then((response) => {
      expect(response.status).to.eq(200);
      const token = response.headers['authorization']?.replace('Bearer ', '');
      expect(token).to.be.a('string');
      testUserToken = token;
    });
  });

  describe('Логин через UI и создание тикета', () => {
    it('Успешный логин и создание нового тикета', () => {
      cy.viewport(1980, 1080);
      cy.visit('http://localhost:3000');

      // Логин существующего пользователя (созданного через API в before)
      cy.get('[placeholder="Email"]').type('testuser@example.com');
      cy.get('[placeholder="Password"]').type('password123');
      cy.get('.login-button').click();

      // Создание тикета
      cy.get('.btn-create').click();
      cy.get('#project').select('CORE');
      cy.get('#title').type('Test ticket after login');
      cy.get('#description').type('This ticket was created after successful login');

      cy.get('#createTicketForm > :nth-child(13)').click();
      cy.get('#createTicketForm > :nth-child(18)').click();

      cy.get('#type').select('BUG');
      // cy.get('#priority').select('Major');

      cy.get('.form-buttons > button').scrollIntoView().click();
      cy.contains('CORE-', { timeout: 10000 }).should('exist');
    });
  });

  describe('Создание Digital пользователя через API и проверка в UI', () => {
    before(() => {
      // Регистрация digital пользователя через API
      const digitalUser = {
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        numberPhone: faker.phone.number('+1 (###) ###-####'),
        password: faker.internet.password({ length: 10 }),
        role: 'Developer', // Якщо потрібно рандомно — скажеш
        project: 'DIGITAL'    // Якщо потрібно рандомно — скажеш
      };

      cy.request({
        method: 'POST',
        url: `${API_URL}/registration`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: digitalUser
      }).then((response) => {
        expect(response.status).to.eq(200);
        const token = response.headers['authorization']?.replace('Bearer ', '');
        expect(token).to.be.a('string');
        digitalUserToken = token;
      });
    });
  });

  describe('Создание нескольких тикетов через API и проверка в UI', () => {
    const tickets = [
      { title: 'API Ticket 1', description: 'First ticket', type: 'TASK', priority: 'Low' },
      { title: 'API Ticket 2', description: 'Second ticket', type: 'BUG', priority: 'Medium' },
      { title: 'API Ticket 3', description: 'Third ticket', type: 'FEATURE', priority: 'High' }
    ];

    before(() => {
      // Создаем тикеты через API
      tickets.forEach(ticket => {
        cy.request({
          method: 'POST',
          url: `${API_URL}/tickets`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${testUserToken}`
          },
          body: {
            project: 'CORE',
            ...ticket
          }
        }).then((response) => {
          expect(response.status).to.eq(201);
        });
      });
    });

  });

  describe('Регистрация нового пользователя через UI', () => {
    it('Успешная регистрация и отображение в списке', () => {
      cy.viewport(1280, 800);
      cy.visit('http://localhost:3000');
      cy.get('.register-link').click();

      const randomName = faker.name.firstName();
      const randomSurname = faker.name.lastName();
      const randomEmail = faker.internet.email();
      const randomPhone = faker.phone.number('+1 (###) ###-####');
      const randomPassword = faker.internet.password();

      cy.get('[placeholder="Name"]').type(randomName);
      cy.get('[placeholder="Surname"]').type(randomSurname);
      cy.get('[placeholder="Email"]').type(randomEmail);
      cy.get('[placeholder="Phone number"]').type(randomPhone);
      cy.get('[placeholder="Password"]').type(randomPassword);

      cy.get('.registration-form > :nth-child(5)').select('Project Owner');
      cy.get('.registration-form > :nth-child(6)').select('CORE');

      cy.get('.submit-button').click();
    });
  });

  describe('Создание тикета после регистрации', () => {
    it('Полный цикл: регистрация -> создание тикета', () => {
      cy.viewport(1980, 1080);
      // Регистрация через API
      cy.visit('http://localhost:3000');
      cy.get('.register-link').click();

      const randomName = faker.name.firstName();
      const randomSurname = faker.name.lastName();
      const randomEmail = faker.internet.email();
      const randomPhone = faker.phone.number('+1 (###) ###-####');
      const randomPassword = faker.internet.password();

      cy.get('[placeholder="Name"]').type(randomName);
      cy.get('[placeholder="Surname"]').type(randomSurname);
      cy.get('[placeholder="Email"]').type(randomEmail);
      cy.get('[placeholder="Phone number"]').type(randomPhone);
      cy.get('[placeholder="Password"]').type(randomPassword);

      cy.get('.registration-form > :nth-child(5)').select('Project Owner');
      cy.get('.registration-form > :nth-child(6)').select('CORE');

      cy.get('.submit-button').click();

        // Создание тикета
        cy.get('.btn-create').click();
        cy.get('#project').select('CORE');
        cy.get('#title').type('Ticket after API registration');
        cy.get('#description').type('Created after API registration');

        cy.get('#createTicketForm > :nth-child(13)').click();
        cy.get('#createTicketForm > :nth-child(18)').click();

        cy.get('#type').select('BUG');

        cy.get('.form-buttons > button').scrollIntoView().click();
        cy.contains('CORE-', { timeout: 10000 }).should('exist');
      });
    });
});