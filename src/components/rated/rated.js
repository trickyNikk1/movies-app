import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Spin, Alert, Pagination } from 'antd'
import './rated.css'
import Cards from '../cards'
import MovieDBService from '../../services/movies-db'
import ErrorMessage from '../error-message'

const { ErrorBoundary } = Alert
const moviesDB = new MovieDBService()

export default function Rated({ sessionId = '', isActive = false, onRate = () => {} }) {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(true)
  const [error, setError] = useState(null)
  const [pages, setPages] = useState({ page: 0, totalPages: 0, totalResults: 0 })

  useEffect(() => {
    setIsLoaded(false)
    if (isActive) {
      moviesDB.getRated(sessionId).then(
        ({ results, totalPages, page, totalResults }) => {
          setPages({ page, totalPages, totalResults })
          setIsLoaded(true)
          setMovies(results)
          setError(null)
        },
        (error) => {
          setPages({ page: 0, totalPages: 0, totalResults: 0 })
          setIsLoaded(true)
          setError(error)
        }
      )
    }
  }, [isActive, sessionId])

  const changePage = (page) => {
    setIsLoaded(false)
    moviesDB.getRated(sessionId, page).then(
      ({ results, totalPages, page, totalResults }) => {
        setPages({ page, totalPages, totalResults })
        setIsLoaded(true)
        setMovies(results)
        setError(null)
      },
      (error) => {
        setPages({ page: 0, totalPages: 0, totalResults: 0 })
        setIsLoaded(true)
        setError(error)
      }
    )
  }

  const hasData = !(!isLoaded || error)
  const spinner = !isLoaded ? <Spin size="large" /> : null
  const cards = hasData ? <Cards movies={movies} sessionId={sessionId} onRate={onRate} /> : null
  const pagination =
    pages.totalPages > 1 ? (
      <Pagination
        className="rated__pagination"
        align="center"
        defaultPageSize={20}
        current={pages.page}
        total={pages.totalResults}
        showSizeChanger={false}
        responsive
        onChange={changePage}
      />
    ) : null
  return (
    <ErrorBoundary>
      <div className="rated">
        <div className="rated__body">
          <ErrorMessage error={error} />
          {spinner}
          {cards}
          {pagination}
        </div>
      </div>
    </ErrorBoundary>
  )
}

Rated.propTypes = {
  sessionId: PropTypes.string,
  isActive: PropTypes.bool,
  onRate: PropTypes.func,
}
