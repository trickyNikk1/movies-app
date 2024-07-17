import React from 'react'
import { createRoot } from 'react-dom/client'
import MoviesApp from './components/movies-app'
import 'inter-ui/inter.css'
import './style.css'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(<MoviesApp />)
