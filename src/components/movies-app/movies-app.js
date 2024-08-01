import React, { useState, useEffect } from 'react'
import { Alert, Tabs, Spin } from 'antd'
import './movies-app.css'
import MovieDBService from '../../services/movies-db'
import SearchContainer from '../search-container'
import Rated from '../rated'
import ErrorMessage from '../error-message'
import { GenresProvider } from '../genres-context'
const { ErrorBoundary } = Alert

export default function MoviesApp() {
  const [guestSessionId, setGuestSessionId] = useState('')
  const [genres, setGenres] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('search')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [rated, setRated] = useState([])

  useEffect(() => {
    const moviesDB = new MovieDBService()
    moviesDB.createNewGuestSession().then(
      (id) => {
        setGuestSessionId(id)
        setIsLoaded(true)
      },
      (error) => {
        setError(error)
        setIsLoaded(true)
      }
    )
    moviesDB.getGenres().then(
      (genres) => {
        setGenres(genres)
      },
      (error) => {
        setError(error)
      }
    )
  }, [])
  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true))
    window.addEventListener('offline', () => setIsOnline(false))

    return () => {
      window.removeEventListener('online', () => setIsOnline(true))
      window.removeEventListener('offline', () => setIsOnline(false))
    }
  }, [])
  const onRate = (movie, rating) => {
    setRated((prevRated) => {
      const newRated = [{ ...movie, rating }]
      return newRated.concat(prevRated)
    })
  }

  const offlineMessage = (
    <Alert
      message="What the heck with your network?"
      description="Try to find a free Wi-Fi or something, idk."
      type="warning"
    />
  )
  const handleChange = (key) => {
    key === 'rated' ? setActiveTab('rated') : setActiveTab('search')
  }
  const hasData = !(!isLoaded || error)
  const spinner = !isLoaded ? <Spin size="large" /> : null
  const tabs = hasData ? (
    <Tabs
      onChange={handleChange}
      className="movies-app__tabs"
      indicator={{
        size: 65,
        align: 'center',
      }}
      centered
      defaultActiveKey="1"
      items={[
        {
          label: 'Search',
          key: 'search',
          children: <SearchContainer onRate={onRate} sessionId={guestSessionId} rated={rated} />,
        },
        {
          label: 'Rated',
          key: 'rated',
          children: <Rated onRate={onRate} sessionId={guestSessionId} isActive={activeTab === 'rated'} />,
        },
      ]}
    />
  ) : null
  const app = (
    <section className="movies-app container">
      <ErrorMessage error={error} />
      {tabs}
      {spinner}
    </section>
  )
  return (
    <ErrorBoundary>
      <GenresProvider value={genres}>
        <main className="main">{isOnline ? app : offlineMessage}</main>
      </GenresProvider>
    </ErrorBoundary>
  )
}
