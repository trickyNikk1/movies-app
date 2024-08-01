import { Rate } from 'antd'
import PropTypes from 'prop-types'
import { format, parseISO } from 'date-fns'
import './card.css'
import noPosterPic from './no-poster.png'
import MovieDBService from '../../services/movies-db'
import Tags from '../tags/tags'
import MediaQuery from 'react-responsive'

const moviesDB = new MovieDBService()

export default function Card({ movie = {}, sessionId = '' }) {
  const { title, releaseDate, overview, posterPath, voteAverage, id, rating, genreIds } = movie
  const formatDate = releaseDate ? format(parseISO(releaseDate), 'MMMM dd, yyyy') : 'no data available'
  const posterUrl = posterPath ? 'https://image.tmdb.org/t/p/w300' + posterPath : noPosterPic
  const cutText = (text, limit = 20) => {
    if (text.length === 0) {
      return '...'
    }
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
  const card = (
    <article className="card">
      <div className="card__img-wrapper">
        <img className="card__img" alt="movie poster" src={posterUrl} />
      </div>
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
  const cardMobile = (
    <article className="card">
      <div className="card__description">
        <div className="card__header">
          <div className="card__img-wrapper">
            <img className="card__img" alt="movie poster" src={posterUrl} />
          </div>
          <div className="card__header-inner">
            <h2 className="card__title">{title}</h2>
            <span className="card__date">{formatDate}</span>
            <br></br>
            <Tags genreIds={genreIds} />
          </div>
          <span className={rateClassNames}>{rate}</span>
        </div>
        <div className="card__text-container">
          <p className="card__text">{cutText(overview, 30)}</p>
        </div>
        <Rate className="card__stars" allowHalf count={10} defaultValue={currentRate} onChange={handleChange} />
      </div>
    </article>
  )

  return (
    <>
      <MediaQuery minWidth={520.1}>{card}</MediaQuery>
      <MediaQuery maxWidth={520}>{cardMobile}</MediaQuery>
    </>
  )
}

Card.propTypes = {
  sessionId: PropTypes.string,
  movie: PropTypes.object,
}
