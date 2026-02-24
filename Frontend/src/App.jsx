import { useState, useEffect, useCallback } from 'react'
import './App.css'

const BACKEND_URL = 'http://localhost:3000'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

function GameCard({ game, index }) {
  const [imgError, setImgError] = useState(false)
  const discount = game.discount_percent

  const platformColors = {
    'EA App': '#ff6b35',
    'Xbox Live': '#107c10',
    'Nintendo': '#e4000f',
    'PSN': '#003791',
    'Rockstar': '#c8a951',
  }

  const color = platformColors[game.platform] || '#888'

  return (
    <div className="game-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="card-image-wrap">
        {imgError ? (
          <div className="card-img-fallback">
            <span>{game.title.charAt(0)}</span>
          </div>
        ) : (
          <img
            src={game.image_url}
            alt={game.title}
            className="card-img"
            onError={() => setImgError(true)}
          />
        )}
        {discount && (
          <div className="card-badge">CASHBACK</div>
        )}
        <div className="card-platform" style={{ background: color }}>
          <span className="platform-dot" />
          {game.platform}
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{game.title}</h3>
        <div className={`card-region ${game.region === 'GLOBAL' ? 'region-global' : 'region-europe'}`}>
          {game.region}
        </div>

        <div className="card-pricing">
          {game.original_price && discount && (
            <div className="card-original">
              <span className="original-price">€{game.original_price.toFixed(2)}</span>
              <span className="discount-badge">-{discount}%</span>
            </div>
          )}
          <div className="card-current">€{game.current_price.toFixed(2)}</div>
          {game.cashback && (
            <div className="card-cashback">Cashback: €{game.cashback.toFixed(2)}</div>
          )}
        </div>

        <div className="card-footer">
          <div className="card-likes">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {game.likes.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const [games, setGames] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  const fetchGames = useCallback(async (search) => {
    setLoading(true)
    try {
      const url = search
        ? `${BACKEND_URL}/list?search=${encodeURIComponent(search)}`
        : `${BACKEND_URL}/list`
      const res = await fetch(url)
      const data = await res.json()
      setGames(data.results)
      setCount(data.count)
    } catch (err) {
      console.error('Failed to fetch games:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames(debouncedQuery)
  }, [debouncedQuery, fetchGames])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#6c3fff"/>
                <path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="#ff6b35" opacity="0.9"/>
                <path d="M20 10 Q32 20 20 30 Q8 20 20 10Z" fill="#00d4aa" opacity="0.8"/>
              </svg>
            </div>
            <span className="logo-text">eneba</span>
          </div>

          <div className="search-wrap">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search games..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          <div className="header-actions">
            <button className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button className="action-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
            <button className="action-btn avatar-btn">T</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="results-bar">
          {loading ? (
            <span className="results-count">Searching...</span>
          ) : (
            <span className="results-count">
              Results found: <strong>{count}</strong>
            </span>
          )}
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎮</div>
            <p>No games found for "<strong>{query}</strong>"</p>
          </div>
        ) : (
          <div className="games-grid">
            {games.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
