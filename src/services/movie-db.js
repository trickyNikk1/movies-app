export default class MovieDBService {
  _apiBase = 'https://api.themoviedb.org'
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDliZDhhNjhkZDhjOTc0NTAzM2EyZGIyNDkzZDk1OSIsIm5iZiI6MTcyMDg0ODYyNy40NjYzNDgsInN1YiI6IjY2OTIwZDVhYzM4ZGUyNDcxZTVlN2VkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H677OgJ1gEr1S0G7TmJoXL0FPypDmiLvkrhU_Zgmru8',
    },
  }
  url = this._apiBase + this._searchEndPoint + this.parameters
  async getResource(url, options) {
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
    const res = await this.getResource(url, this.options)
    if (keyWord.length !== 0 && res.results.length === 0) {
      throw new Error('No results.')
    }
    return this._transformData(res)
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
