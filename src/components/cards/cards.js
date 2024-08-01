import React from 'react'
import PropTypes from 'prop-types'
import Card from '../card/card'
import './cards.css'

export default function Cards({ movies = [], sessionId = '', onRate = () => {}, rated = [] }) {
  const elements = movies.map((movie) => {
    const ratedMovie = rated.find((item) => item.id === movie.id)
    if (ratedMovie) {
      return <Card key={ratedMovie.id} movie={ratedMovie} sessionId={sessionId} onRate={onRate} />
    }
    return <Card key={movie.id} movie={movie} sessionId={sessionId} onRate={onRate} />
  })
  return <div className="cards">{elements}</div>
}

Cards.propTypes = {
  movies: PropTypes.array,
  sessionId: PropTypes.string,
  onRate: PropTypes.func,
  rated: PropTypes.array,
}
