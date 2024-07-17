import React, { useState, useEffect } from 'react'
import { Spin, Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'
import './movies-app.css'
import Cards from '../cards'
import MovieDBService from '../../services/movie-db'

export default function MoviesApp() {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const hasData = !(!isLoaded || error)
  useEffect(() => {
    const moviesDB = new MovieDBService()
    moviesDB.getMovies('return').then(
      (result) => {
        setIsLoaded(true)
        setMovies(result)
      },
      (error) => {
        setIsLoaded(true)
        setError(error)
      }
    )
  }, [])
  const errorMessage = error ? (
    <Alert
      message={'Oh, man! ' + error.name}
      description={error.message + 'Shit happens... Try to turn on a damn VPN and reload the page.'}
      type="error"
    />
  ) : null
  const offlineErrorMessage = (
    <Alert
      message="What the heck with your network?"
      description="Try to find a free Wi-Fi or something, idk."
      type="error"
    />
  )
  const spinner = !isLoaded ? <Spin size="large" /> : null
  const cards = hasData ? <Cards movies={movies} /> : null
  return (
    <main className="main">
      <section className="movies-app container">
        <div className="movies-app_body">
          <Online>
            {errorMessage}
            {spinner}
            {cards}
          </Online>
          <Offline>{offlineErrorMessage}</Offline>
          <div className="pagination" />
        </div>
      </section>
    </main>
  )
}
