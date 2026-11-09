describe('Pokemon Theme Team - Team Generation Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('fetches and displays a team of 6 pokemon when clicked', () => {
    cy.intercept('GET', 'https://pokeapi.co/api/v2/pokemon/**').as('getPokemon')
    cy.intercept('GET', 'https://pokeapi.co/api/v2/type/**').as('getType')

    cy.get('button.generate-btn').click()
    cy.get('button.generate-btn').should('be.disabled')

    cy.wait('@getPokemon', { timeout: 10000 })
    cy.wait('@getType', { timeout: 10000 })

    cy.get('.team-grid', { timeout: 15000 })
      .children('.pokemon-card')
      .should('have.length', 6)

    cy.get('.pokemon-card').first().should('have.class', 'lead')

    cy.get('.pokemon-card').each(($card) => {
      cy.wrap($card).find('.pokemon-image').should('be.visible')
      cy.wrap($card).find('.pokemon-name').should('not.be.empty')
      cy.wrap($card).find('.type-badge').should('be.visible')
    })
  })
})