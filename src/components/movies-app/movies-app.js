import React, { useState, useEffect } from 'react'
import { Alert, Tabs } from 'antd'
import './movies-app.css'
import MovieDBService from '../../services/movies-db'
import SearchContainer from '../search-container'
import Rated from '../rated'
import { GenresProvider } from '../genres-context'

export default function MoviesApp() {
  const [guestSessionId, setGuestSessionId] = useState('')
  const [genres, setGenres] = useState({})
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('search')
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const moviesDB = new MovieDBService()
    moviesDB.createNewGuestSession().then(
      (id) => {
        setGuestSessionId(id)
      },
      (error) => {
        setError(error)
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

  const renderErrorMessage = (error) => {
    if (!error) {
      return null
    }
    if (error.message === 'NetworkError when attempting to fetch resource.') {
      return (
        <Alert
          message={'Oh, man!'}
          description={'Network Error! Try to to turn on a VPN and reload the page.'}
          type="error"
        />
      )
    }
    return <Alert message={'Wow! ' + error.name} description={error.message} type="error" />
  }

  const offlineMessage = (
    <Alert
      message="What the heck with your network?"
      description="Try to find a free Wi-Fi or something, idk."
      type="warning"
    />
  )
  const handleChange = (key) => {
    if (key === 'rated') {
      setActiveTab('rated')
    } else {
      setActiveTab('search')
    }
  }
  const tabs = (
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
          children: <SearchContainer sessionId={guestSessionId} />,
        },
        {
          label: 'Rated',
          key: 'rated',
          children: <Rated sessionId={guestSessionId} isActive={activeTab === 'rated'} />,
        },
      ]}
    />
  )
  const app = <section className="movies-app container">{error ? renderErrorMessage(error) : tabs}</section>
  return (
    <GenresProvider value={genres}>
      <main className="main">{isOnline ? app : offlineMessage}</main>
    </GenresProvider>
  )
}
