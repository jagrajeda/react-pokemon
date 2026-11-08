import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('')

  const fetchThemeTeam = async () => {
    setLoading(true)
    setError(null)
    setTeam([])

    try {
      // 1. Pick a random Pokemon ID (Gen 1-8 up to 898)
      const randomId = Math.floor(Math.random() * 898) + 1
      const initialResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      const leadPokemon = initialResponse.data

      // 2. Extract primary type
      const primaryType = leadPokemon.types[0].type.name
      setSelectedType(primaryType)

      // 3. Request type data to discover other Pokemon sharing this type
      const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type/${primaryType}`)
      const sameTypeEntries = typeResponse.data.pokemon

      // Filter out the lead Pokemon from pool
      const filteredPool = sameTypeEntries.filter(
        item => item.pokemon.name !== leadPokemon.name
      )

      // 4. Shuffle pool and select 5 additional teammates
      const shuffled = [...filteredPool].sort(() => 0.5 - Math.random())
      const selectedFive = shuffled.slice(0, 5)

      // 5. Fetch details for the 5 teammates in parallel
      const teammateRequests = selectedFive.map(item => axios.get(item.pokemon.url))
      const teammateResponses = await Promise.all(teammateRequests)

      const fullTeam = [
        leadPokemon,
        ...teammateResponses.map(res => res.data)
      ]

      setTeam(fullTeam)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch Pokemon team. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-container">
      <header>
        <h1>Pokemon Theme Team Generator</h1>
        <p className="subtitle">
          {selectedType
            ? `Current Theme: ${selectedType.toUpperCase()}`
            : 'Click the button below to generate a random 6-Pokemon themed team.'}
        </p>
      </header>

      <button
        type="button"
        className="generate-btn"
        onClick={fetchThemeTeam}
        disabled={loading}
      >
        {loading ? 'Building Team...' : 'Generate Theme Team'}
      </button>

      {error && <p className="status-message error-message">{error}</p>}
      {loading && <p className="status-message">Fetching Pokemon from PokeAPI...</p>}

      <section className="team-grid">
        {team.map((pokemon, index) => {
          const sprite =
            pokemon.sprites?.front_default ||
            pokemon.sprites?.other?.['official-artwork']?.front_default ||
            ''

          return (
            <article
              key={`${pokemon.id}-${index}`}
              className={`pokemon-card ${index === 0 ? 'lead' : ''}`}
            >
              <img
                src={sprite}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <span className="pokemon-name">{pokemon.name}</span>
              <span className="type-badge">
                {pokemon.types.map(t => t.type.name).join(' / ')}
              </span>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default App