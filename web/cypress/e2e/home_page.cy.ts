/// <reference types="cypress" />

describe('The Home Page', () => {
	before(() => {
		cy.setCookie(
			'qid',
			's%3AHbmenMHP44GQEb7kNzQawYHfYQSfuPO7.jSRqlplZJv7ZR0q7iBb5P%2FIXTRF%2BApR1qpdavYyHSDo'
		);
		cy.visit('/');
	});

	it(`throws an error because it doesn't find customer`, () => {
		cy.get('.solo-input').type('hello{enter}');
		cy.get('.solo-input').clear();
		cy.location('pathname').should('eq', '/');
	});

	it('finds customer with specified CIN', () => {
		cy.get('.solo-input').clear();
		cy.get('.solo-input').type('14772345{enter}');
		cy.location('pathname').should('eq', '/customers/14772345');
	});

	it('goes back to home page', () => {
		cy.get('.mdc-button__ripple').click({ force: true });
	});

	it('goes to register page', () => {
		cy.get(':nth-child(2) > .mdc-tab__ripple').click();
		cy.get(':nth-child(1) > .mdc-text-field__input').type('he');
		cy.get(':nth-child(2) > .mdc-text-field__input').type('he');
		cy.get(':nth-child(3) > .mdc-text-field__input').type('he');
		cy.get(':nth-child(4) > .mdc-text-field__input').type('he');
		cy.get(':nth-child(5) > .mdc-text-field__input').type('he');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(1) > .mdc-text-field__input').clear().type('hey');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(2) > .mdc-text-field__input').clear().type('hey');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(3) > .mdc-text-field__input').clear().type('eightchs');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(3) > .mdc-text-field__input').clear().type('12345678');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(4) > .mdc-text-field__input').clear().type('eightchs');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(4) > .mdc-text-field__input').clear().type('12345678');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(5) > .mdc-text-field__input').clear().type('twelvechars');
		cy.get('.mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(5) > .mdc-text-field__input').clear().type('123456789123');
		cy.get('.mdc-button__ripple').click({ force: true });
	});

	it('goes to transaction page', () => {
		cy.get(':nth-child(3) > .mdc-tab__ripple').click();

		cy.get(':nth-child(1) > .mdc-text-field__input').type('he');
		cy.get(':nth-child(2) > .mdc-text-field__input').type('he');
		cy.get(':nth-child(3) > .mdc-text-field__input').type('he');
		cy.get('form.s-3bsNtbAMh94P > .mdc-button > .mdc-button__ripple').click({ force: true });

		cy.get(':nth-child(1) > .mdc-text-field__input').clear().type('eightchs');
		cy.get('form.s-3bsNtbAMh94P > .mdc-button > .mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(1) > .mdc-text-field__input').clear().type('12345678');
		cy.get('form.s-3bsNtbAMh94P > .mdc-button > .mdc-button__ripple').click({ force: true });

		cy.get(':nth-child(2) > .mdc-text-field__input').clear().type('twelvechars');
		cy.get('form.s-3bsNtbAMh94P > .mdc-button > .mdc-button__ripple').click({ force: true });
		cy.get(':nth-child(2) > .mdc-text-field__input').clear().type('123456789123');
		cy.get('form.s-3bsNtbAMh94P > .mdc-button > .mdc-button__ripple').click({ force: true });
	});

	it('toggles transactions', () => {
		cy.get('.mdc-button__label').click();
	});

	it('logs out', () => {
		cy.get('.mdc-fab').click();
	});
});

export {};
