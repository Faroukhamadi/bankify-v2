describe('The Login Page', () => {
	it('successfully loads', () => {
		cy.visit('/login');
	});

	it(`throws an error because user doesn't exist`, () => {
		cy.get(':nth-child(1) > .mdc-text-field__input').type('usernameThatDoesntExist').clear();
		cy.get(':nth-child(2) > .mdc-text-field__input').type('passwordThatDoesntExist').clear();
		cy.get('.mdc-button__ripple').click();
	});

	it(`throws an error because password is wrong`, () => {
		cy.get(':nth-child(1) > .mdc-text-field__input').type('ben');
		cy.get(':nth-child(2) > .mdc-text-field__input').type('wrong password');
		cy.get('.mdc-button__ripple').click();
	});
});

export {};
