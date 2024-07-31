export default class MovieDBService {
  _apiBase = 'https://api.themoviedb.org'
  _apiKey = 'bd9bd8a68dd8c9745033a2db2493d959'
  _accessToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDliZDhhNjhkZDhjOTc0NTAzM2EyZGIyNDkzZDk1OSIsIm5iZiI6MTcyMDg0ODYyNy40NjYzNDgsInN1YiI6IjY2OTIwZDVhYzM4ZGUyNDcxZTVlN2VkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H677OgJ1gEr1S0G7TmJoXL0FPypDmiLvkrhU_Zgmru8'
  async getResource(url) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this._accessToken}`,
      },
    }
    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${this.url}, received ${res.status}`)
    }
    return await res.json()
  }
  async getData(keyWord, page = 1) {
    const searchEndPoint = '/3/search/movie'
    const parameters = `?query=${keyWord}&include_adult=true&language=en-US&page=${page}`
    const url = this._apiBase + searchEndPoint + parameters
    const res = await this.getResource(url)
    if (keyWord.length !== 0 && res.results.length === 0) {
      throw new Error('No results.')
    }
    return this._transformData(res)
  }
  async createNewGuestSession() {
    const endPoint = '/3/authentication/guest_session/new'
    const url = this._apiBase + endPoint
    const res = await this.getResource(url)
    return res.guest_session_id
  }

  async getRated(guestSessionId, page = 1) {
    const endPoint = `/3/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${page}`
    const url = this._apiBase + endPoint
    const res = await this.getResource(url)
    return this._transformData(res)
  }
  async rateMovie(movieId, sessionId, rate) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this._accessToken}`,
      },
      body: `{"value":${rate}}`,
    }
    const apiKey = 'bd9bd8a68dd8c9745033a2db2493d959'
    const endPoint = `/3/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${sessionId}`
    const url = this._apiBase + endPoint
    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(`Could not fetch ${this.url}, received ${res.status}`)
    }
    return true
  }
  async getGenres() {
    const endPoint = '/3/genre/movie/list?language=en'
    const url = this._apiBase + endPoint
    const res = await this.getResource(url)
    return res.genres
  }
  _transformData(data) {
    const formatMoviesData = data.results.map((movie) => {
      return {
        id: movie.id,
        genreIds: movie.genre_ids,
        posterPath: movie.poster_path,
        title: movie.title,
        releaseDate: movie.release_date,
        overview: movie.overview,
        voteAverage: movie.vote_average,
        rating: movie.rating,
      }
    })
    const formatData = {
      page: data.page,
      results: formatMoviesData,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    }
    return formatData
  }
}
