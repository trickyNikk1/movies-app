import React, { useEffect, useState } from 'react'
import { Spin, Alert, Pagination } from 'antd'
import './rated.css'
import Cards from '../cards'
import MovieDBService from '../../services/movies-db'
const moviesDB = new MovieDBService()

export default function Rated({ sessionId, isActive }) {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(true)
  const [error, setError] = useState(null)
  const [pages, setPages] = useState({ page: 0, totalPages: 0, totalResults: 0 })

  useEffect(() => {
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

  const renderErrorMessage = (error) => {
    if (!error) {
      return null
    }
    if (error.message === 'NetworkError when attempting to fetch resource.') {
      return (
        <Alert
          message={'Oh, man!'}
          description={'Network Error! Try to to turn on a VPN and reload the page'}
          type="error"
        />
      )
    }
    if (error.message === 'Could not fetch undefined, received 404') {
      return <Alert message={'No rated movies.'} description={'Rate something to add it here.'} type="info" />
    }
    return <Alert message={'Wow! ' + error.name} description={error.message} type="error" />
  }

  const hasData = !(!isLoaded || error)
  const spinner = !isLoaded ? <Spin size="large" /> : null
  const cards = hasData ? <Cards movies={movies} sessionId={sessionId} /> : null
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
    <div className="rated">
      <div className="rated__body">
        {renderErrorMessage(error)}
        {spinner}
        {cards}
        {pagination}
      </div>
    </div>
  )
}
