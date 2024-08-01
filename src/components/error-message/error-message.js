import React from 'react'
import { Alert } from 'antd'
export default function ErrorMessage({ error }) {
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
