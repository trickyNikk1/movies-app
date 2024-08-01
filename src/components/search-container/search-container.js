import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Spin, Alert, Input, Pagination } from 'antd'
import { debounce } from 'lodash'
import './search-container.css'
import Cards from '../cards'
import MovieDBService from '../../services/movies-db'
import ErrorMessage from '../error-message'

const { ErrorBoundary } = Alert
const moviesDB = new MovieDBService()

export default function SearchContainer({ sessionId = '', onRate = () => {}, rated = [] }) {
  const [movies, setMovies] = useState([])
  const [isLoaded, setIsLoaded] = useState(true)
  const [error, setError] = useState(null)
  const [pages, setPages] = useState({ page: 0, totalPages: 0, totalResults: 0 })
  const [value, setValue] = useState('')

  const search = (e) => {
    setIsLoaded(false)
    setError(null)
    setValue(e.target.value)

    moviesDB.getData(e.target.value).then(
      ({ results, totalPages, page, totalResults }) => {
        setPages({ page, totalPages, totalResults })
        setIsLoaded(true)
        setMovies(results)
      },
      (error) => {
        setPages({ page: 0, totalPages: 0, totalResults: 0 })
        setIsLoaded(true)
        setError(error)
      }
    )
  }
  const changePage = (page) => {
    setIsLoaded(false)
    moviesDB.getData(value, page).then(
      ({ results, totalPages, page, totalResults }) => {
        setPages({ page, totalPages, totalResults })
        setIsLoaded(true)
        setMovies(results)
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
  const cards = hasData ? <Cards movies={movies} sessionId={sessionId} onRate={onRate} rated={rated} /> : null
  const pagination =
    pages.totalPages > 1 ? (
      <Pagination
        className="search-container__pagination"
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
      <div className="search-container">
        <Input type="search" onChange={debounce(search, 600)} placeholder="Type to search..." autoFocus />
        <div className="search-container__body">
          <ErrorMessage error={error} />
          {spinner}
          {cards}
          {pagination}
        </div>
      </div>
    </ErrorBoundary>
  )
}

SearchContainer.propTypes = {
  sessionId: PropTypes.string,
  onRate: PropTypes.func,
  rated: PropTypes.array,
}
