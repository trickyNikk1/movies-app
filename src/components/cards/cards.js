import React from 'react'
import Card from '../card/card'
import './cards.css'

export default function Cards({ movies, sessionId }) {
  const elements = movies.map((movie) => {
    return <Card key={movie.id} movie={movie} sessionId={sessionId} />
  })
  return <div className="cards">{elements}</div>
}
