import React from 'react'
import { Tag } from 'antd'
import { format, parseISO } from 'date-fns'
import './card.css'
import noPosterPic from './no-poster.png'
export default function Card(data) {
  const { title, releaseDate, overview, posterPath } = data.movie
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

  return (
    <article className="card">
      <img className="card_img" alt="movie poster" src={posterUrl} />
      <div className="card_body">
        <h2 className="card_title">{title}</h2>
        <span className="card_date">{formatDate}</span>
        <span className="tags">
          <Tag>Action</Tag>
          <Tag>Drama</Tag>
        </span>
        <div className="card_text-container">
          <p className="card_text">{cutText(overview)}</p>
        </div>
      </div>
    </article>
  )
}
