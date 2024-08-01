import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Spin, Alert, Input, Pagination } from 'antd'
import { debounce } from 'lodash'
import './search-container.css'
import Cards from '../cards'
import MovieDBService from '../../services/movies-db'

const { ErrorBoundary } = Alert
const moviesDB = new MovieDBService()

export default function SearchContainer({ sessionId }) {
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
    if (error.message === 'No results.') {
      return <Alert message={'No results for your request.'} description={'Keep it simple!'} type="info" />
    }
    return <Alert message={'Wow! ' + error.name} description={error.message} type="error" />
  }

  const hasData = !(!isLoaded || error)
  const spinner = !isLoaded ? <Spin size="large" /> : null
  const cards = hasData ? <Cards movies={movies} sessionId={sessionId} /> : null
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
          {renderErrorMessage(error)}
          {spinner}
          {cards}
          {pagination}
        </div>
      </div>
    </ErrorBoundary>
  )
}

SearchContainer.defaultProps = {
  sessionId: '',
}

SearchContainer.propTypes = {
  sessionId: PropTypes.string,
}
