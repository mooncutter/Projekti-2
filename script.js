// Odotetaan että DOM on valmis ennen kuin lisätään mitään
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  // Lisätään klikkaus tapahtuma dynaamisesti
  searchBtn.addEventListener("click", searchMovies);
});

// Funktio hakee elokuvat userin syötteen perusteella
function searchMovies() {
  const query = document.getElementById("searchInput").value;
  const apiKey = 'e089163b6333daf1c6334d3f6ac3c5e7'; // Korvaa omalla TMDB API-avaimella
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  // AJAX haku fetchillä
  fetch(url)
    .then(response => response.json())
    .then(data => showResults(data.results)) // Näytetään tulokset
    .catch(error => console.error("Error:", error)); // Virheidenkäsittely
}

// Funktio luo kortit elokuvista ja lisää ne sivulle
function showResults(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ''; // Tyhjennetään vanhat tulokset

  // Käydään jokainen elokuva läpi ja luodaan kortti
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

    // Lisätään korttiin otsikko, kuva ja kuvaus
    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(overview);

    // Lisätään kortti tulosalueelle
    resultsDiv.appendChild(card);
  });
}
