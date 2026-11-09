describe('Pokemon Theme Team - Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the header title and description', () => {
    cy.get('header h1').should('be.visible').and('contain.text', 'Pokemon Theme Team')
    cy.get('.subtitle').should('be.visible')
  })

  it('displays the generate team button', () => {
    cy.get('button.generate-btn')
      .should('be.visible')
      .and('contain.text', 'Generate Theme Team')
  })

  it('starts with an empty team grid', () => {
    cy.get('.team-grid').children().should('have.length', 0)
  })
})