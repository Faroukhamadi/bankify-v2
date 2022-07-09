/// <reference types="cypress" />

describe('The Login Page', () => {
	it('successfully loads', () => {
		cy.visit('/login');
	});

	it(`throws an error because user doesn't exist`, () => {
		cy.get('.username').type('usernameThatDoesntExist');
		cy.get('.password').type('passwordThatDoesntExist');

		cy.get('.mdc-button__ripple').click();

		cy.get('.username').clear();
		cy.get('.password').clear();
	});

	it('throws an error because password is incorrect', () => {
		cy.get('.username').type('ben');
		cy.get('.password').should('not.be.disabled').type('wrong password');

		cy.get('.mdc-button__ripple').click();

		cy.get('.username').clear();
		cy.get('.password').clear();
	});

	// it('logs in and visits the home page', () => {
	// 	cy.get('.username').type('liz');
	// 	cy.get('.password').should('not.be.disabled').type('liz');

	// 	cy.get('.mdc-button__ripple').click();
	// });
});

export {};
