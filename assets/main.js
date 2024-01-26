document.addEventListener('DOMContentLoaded', function () {
  const topRated = document.getElementById('top-rated');
  topRated.classList.add('selected-hover');
  topRatedMovie();
});

const search = document.querySelector('#search-icon');
const movie = document.getElementById("search");
let query = 'The Place Beyond the Pines';
const apiKey = '5d08cdcb6f4d391e26ef46ee466716fa';
let pathPoster = "https://image.tmdb.org/t/p/original";

// FILTERS
const topRated = document.querySelector('#top-rated');
const popular = document.querySelector('#popular');
const upcoming = document.querySelector('#upcoming');
const listMovies = document.querySelector('.list-movies');

// async function findGenre(genreOfMovie) {
//   const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   const genres = data.genres;

//   for (const genre of genres) {
//     if (genre.id === genreOfMovie) {
//       return genre.name;
//     }
//   }
// }

function findGenre(genreOfMovie) {
  return new Promise((resolve, reject) => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const genres = data.genres;

      for (const genre of genres) {
        if (genre.id === genreOfMovie) {
          const genreName = genre.name;
          resolve(genreName);
          return;
        }
      }
      reject(new Error('Genre not found'));
    })
    .catch(error => {
      reject(error);
    });
  });
};

async function createCard(element) {
  const dateDivise = element.release_date.split('-');
  const year = dateDivise[0];

  const card = document.createElement('div');
  card.classList.add('card-movie');

  const img = document.createElement('img');
  img.src = pathPoster + element.poster_path;
  img.alt = element.title;
  img.classList.add('poster');

  const bookmarkIcon = document.createElement('i');
  bookmarkIcon.className = 'bookmark fa-regular fa-bookmark fa-bounce';
  bookmarkIcon.style.color = 'rgb(50, 99, 170)';

  const playButtonIcon = document.createElement('i');
  playButtonIcon.className = 'play-button fa-regular fa-circle-play';
  playButtonIcon.style.color = '#595d64';
  playButtonIcon.style.cursor = 'pointer';

  const overview = document.createElement('p');
  overview.classList.add('overview');
  overview.innerText = element.overview;

  const movieTitle = document.createElement('p');
  movieTitle.classList.add('movie-title');
  movieTitle.innerText = element.title;

  const movieDetails = document.createElement('div');
  movieDetails.classList.add('movie-details');

  const movieDate = document.createElement('p');
  movieDate.classList.add('movie-date');
  movieDate.innerText = year;

  const genreId = element.genre_ids[0];
  const genreName = await findGenre(genreId);

  // On peut faire ça aussi
  // let genreName;
  // try {
  //   genreName = await findGenre(genreId);
  // } catch (error) {
  //   console.error(error);
  //   genreName = 'Genre not found';
  // }

  const movieGenre = document.createElement('p');
  movieGenre.classList.add('movie-genre');
  movieGenre.innerText = genreName;
  movieDetails.appendChild(movieGenre);

  const movieMark = document.createElement('p');
  movieMark.classList.add('movie-mark');
  movieMark.innerText = Math.round(element.vote_average);

  document.querySelector('.list-movies').appendChild(card);
  card.appendChild(img);
  card.appendChild(bookmarkIcon);
  card.appendChild(playButtonIcon);
  card.appendChild(overview);
  card.appendChild(movieTitle);
  card.appendChild(movieDetails);
  movieDetails.appendChild(movieDate);
  movieDetails.appendChild(movieGenre);
  movieDetails.appendChild(movieMark);

  return card;
}

// TOP RATED
async function topRatedMovie() {
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results;

  // Créez un tableau de promesses pour la création des cartes
  const cardPromises = results.map(element => createCard(element));

  // Utilisez Promise.all pour attendre que toutes les cartes soient créées
  Promise.all(cardPromises)
    .then(cards => {
      // Une fois que toutes les cartes sont prêtes, ajoutez-les à la liste
      listMovies.innerHTML = '';
      cards.forEach(card => {
        listMovies.appendChild(card);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

topRated.addEventListener('click', () => {
  listMovies.innerHTML = '';
  topRated.classList.toggle('selected-hover');
  popular.classList.remove('selected-hover');
  upcoming.classList.remove('selected-hover');

  topRatedMovie();
});

//POPULAR
async function popularMovie() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results
  const cardPromises = results.map(element => createCard(element));

  Promise.all(cardPromises)
    .then(cards => {
      listMovies.innerHTML = '';
      cards.forEach(card => {
        listMovies.appendChild(card);
      });
    })
    .catch(error => {
      console.error(error);
    });

  results.forEach(element => {
    const card = createCard(element);
    listMovies.appendChild(card);
  });
}

popular.addEventListener('click', () => {
  listMovies.innerHTML = '';
  popular.classList.toggle('selected-hover');
  topRated.classList.remove('selected-hover');
  upcoming.classList.remove('selected-hover');

  popularMovie();
});

//UPCOMING
async function upcomingMovie() {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results
  const cardPromises = results.map(element => createCard(element));

  Promise.all(cardPromises)
    .then(cards => {
      listMovies.innerHTML = '';
      cards.forEach(card => {
        listMovies.appendChild(card);
      });
    })
    .catch(error => {
      console.error(error);
    });

  results.forEach(element => {
    const card = createCard(element);
    listMovies.appendChild(card);
  });

  results.forEach(element => {
    const card = createCard(element);
    listMovies.appendChild(card);
  });
}

upcoming.addEventListener('click', () => {
  listMovies.innerHTML = '';
  upcoming.classList.toggle('selected-hover');
  topRated.classList.remove('selected-hover');
  popular.classList.remove('selected-hover');

  upcomingMovie();
});

// SEARCH MOVIE
async function searchMovie(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results;
  console.log(data.results);

  results.forEach(element => {
    const card = createCard(element);
    listMovies.appendChild(card);
  });
}

search.addEventListener('click', () => {
  listMovies.innerHTML = '';
  query = movie.value;
  searchMovie(query);
});

// Possible de le faire aussi à chaque Keyup
movie.addEventListener('keyup', () => {
  listMovies.innerHTML = '';
  query = movie.value;
  searchMovie(query);
});

//BOOKMARK
function changeBookmark(bookmark) {
  bookmark.classList.toggle('fa-regular');
  bookmark.classList.toggle('fa-solid');
  bookmark.classList.toggle('fa-bounce');
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('bookmark')) {
    const bookmark = event.target;
    changeBookmark(bookmark);
  }
})
