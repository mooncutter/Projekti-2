// Odotetaan ett‰ DOM on valmis ennen kuin lis‰t‰‰n mit‰‰n
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  // Lis‰t‰‰n klikkaus tapahtuma dynaamisesti
  searchBtn.addEventListener("click", searchMovies);
});

// Funktio hakee elokuvat userin syˆtteen perusteella
function searchMovies() {
  const query = document.getElementById("searchInput").value;
  const apiKey = 'YOUR_API_KEY'; // Korvaa omalla TMDB API-avaimella
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  // AJAX haku fetchill‰
  fetch(url)
    .then(response => response.json())
    .then(data => showResults(data.results)) // N‰ytet‰‰n tulokset
    .catch(error => console.error("Error:", error)); // Virheidenk‰sittely
}

// Funktio luo kortit elokuvista ja lis‰‰ ne sivulle
function showResults(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ''; // Tyhjennet‰‰n vanhat tulokset

  // K‰yd‰‰n jokainen elokuva l‰pi ja luodaan kortti
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const img = document.createElement("img");
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/200x300?text=No+Image";

    const overview = document.createElement("p");
    overview.textContent = movie.overview;

    // Lis‰t‰‰n korttiin otsikko, kuva ja kuvaus
    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(overview);

    // Lis‰t‰‰n kortti tulosalueelle
    resultsDiv.appendChild(card);
  });
}