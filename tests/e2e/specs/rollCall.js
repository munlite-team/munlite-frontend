// import store from '../../../src/store/index';

// describe('Read Vuex Store', () => {
//   it('has delegates list', () => {
//     expect(store.state.delegates[0].name).to.equal('Australia');
//   });
// });

describe('Roll Call Modal Test', () => {
  it('Render Modal', () => {
    cy.visit('/delegates');
    cy.get('button')
      .contains('Roll Call')
      .click();
    cy.contains('h2', 'Roll Call').should('be.visible');
  });
  it('Roll call then proceed to vote', () => {
    cy.get('button#continue').should('be.disabled').contains('Continue');
    let dataLength = 0;
    cy.request('GET', 'https://dev.api.munlite.co/api/conference/5f96e22bdb7ee38458e581e9/delegates').then((response) => {
      dataLength = response.body.data;
      for (let i = 0; i < dataLength; i += 1) {
        cy.get('button').contains('Present').click();
        cy.wait(850);
      }
      cy.wait(850);
      cy.get('button').contains('Continue').click();
      cy.get('#select .selection:first-child .input').type('4');
      cy.get('.input.red').type('3');
      cy.get('button').contains('Pass').click();
    });
  });
  it('Redirects to GSL', () => {
    cy.wait(1000);
    cy.url().should('include', '/gsl');
  });
});
