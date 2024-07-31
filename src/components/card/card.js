import React from 'react'
import { Rate } from 'antd'
import { format, parseISO } from 'date-fns'
import './card.css'
import noPosterPic from './no-poster.png'
import MovieDBService from '../../services/movies-db'
import Tags from '../tags/tags'

const moviesDB = new MovieDBService()

export default function Card({ movie, sessionId }) {
  const { title, releaseDate, overview, posterPath, voteAverage, id, rating, genreIds } = movie
  const formatDate = releaseDate ? format(parseISO(releaseDate), 'MMMM dd, yyyy') : 'no data available'
  const posterUrl = posterPath ? 'https://image.tmdb.org/t/p/original' + posterPath : noPosterPic
  const cutText = (text) => {
    if (text.length === 0) {
      return '...'
    }
    const limit = 20
    const textArr = text.split(' ')
    if (textArr.length <= limit) {
      return text
    }
    const cutArr = textArr.slice(0, limit)
    const lastWord = cutArr[limit - 1]
    const lastSymbol = lastWord[lastWord.length - 1]
    if (lastSymbol === ',' || lastSymbol === '.' || lastSymbol === ':' || lastSymbol === ';') {
      cutArr[limit - 1] = lastWord.slice(0, lastWord.length - 1)
    }
    const cut = cutArr.join(' ') + '...'
    return cut
  }
  const rate = voteAverage.toFixed(1)
  let rateClassNames = 'card__rate'
  if (voteAverage < 3) {
    rateClassNames = rateClassNames + ' card__rate_bad'
  } else if (voteAverage < 5) {
    rateClassNames = rateClassNames + ' card__rate_ok'
  } else if (voteAverage < 7) {
    rateClassNames = rateClassNames + ' card__rate_good'
  } else {
    rateClassNames = rateClassNames + ' card__rate_super'
  }
  const handleChange = (value) => {
    moviesDB.rateMovie(id, sessionId, value).then(
      () => {},
      (error) => console.error(error)
    )
  }
  const currentRate = rating ? rating : 0

  return (
    <article className="card">
      <img className="card__img" alt="movie poster" src={posterUrl} />
      <div className="card__description">
        <div className="card__header">
          <h2 className="card__title">{title}</h2>
          <span className={rateClassNames}>{rate}</span>
        </div>
        <span className="card__date">{formatDate}</span>
        <Tags genreIds={genreIds} />
        <div className="card__text-container">
          <p className="card__text">{cutText(overview)}</p>
        </div>
        <Rate className="card__stars" allowHalf count={10} defaultValue={currentRate} onChange={handleChange} />
      </div>
    </article>
  )
}
