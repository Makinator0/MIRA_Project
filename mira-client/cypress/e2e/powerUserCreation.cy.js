describe('Регистрация нового пользователя через UI', () => {
    it('Регистрация пользователя Maksim Hasiuk', () => {
        cy.viewport(1280, 800);
        cy.visit('http://localhost:3000');
        cy.get('.register-link').click();

        cy.get('[placeholder="Name"]').type('Maksim');
        cy.get('[placeholder="Surname"]').type('Hasiuk');
        cy.get('[placeholder="Email"]').type('maksimafom@gmail.com');
        cy.get('[placeholder="Phone number"]').type('0986294196');
        cy.get('[placeholder="Password"]').type('2707');

        cy.get('.registration-form > :nth-child(5)').select('Project Owner');
        cy.get('.registration-form > :nth-child(6)').select('CORE');

        cy.get('.submit-button').click();
    });
});
