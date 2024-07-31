import React from 'react'
import { Tag } from 'antd'
import { GenresConsumer } from '../genres-context'
export default function Tags({ genreIds }) {
  return (
    <GenresConsumer>
      {(genres) => {
        const tags = genreIds.map((id) => {
          const name = genres.find((genre) => genre.id === id).name
          return <Tag key={id}>{name}</Tag>
        })
        return <span className="tags">{tags ? tags : 'no genre'}</span>
      }}
    </GenresConsumer>
  )
}
