context('Users', () => {
  it('registers new user and deletes them', () => {
    const username = 'new_user_' + Math.floor(Math.random() * 1000000000);
    const password = '_password_';

    cy.visit('http://localhost:3000/register')
      .get('#username')
      .type(username)
      .should('have.value', username)

      .get('#password1')
      .type(password)
      .should('have.value', password)

      .get('#password2')
      .type(password)
      .should('have.value', password)

      .get('#submit')
      .click()

      .wait(1000)

      .url()
      .should('contain', '/account/')
      .getCookie('connect.sid')
      .should('exist')

      // Retains auth for new user after reload
      .reload()
      .url()
      .should('contain', '/account/')
      .getCookie('connect.sid')
      .should('exist')

      // Delete user
      .get('button[title="Delete"]')
      .click()
      .get('td.MuiTableCell-root.MuiTableCell-body .MuiIconButton-root:nth-child(1)')
      .click()

      // Redirects back to login
      .reload()

      .wait(1000)

      .url()
      .should('contain', '/login')

      .end();
  });
});
