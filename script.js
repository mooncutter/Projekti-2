document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const theaterSelect = document.getElementById("theaterSelect");

  searchBtn.addEventListener("click", searchMovies);
  theaterSelect.addEventListener("change", fetchFinnkinoSchedule);

  fetchFinnkinoTheaters(); // Haetaan teatterit dropdowniin
});

// === TMDB-haku ===
function searchMovies() {
  const query = document.getElementById("searchInput").value;
  const apiKey = 'e089163b6333daf1c6334d3f6ac3c5e7'; // Oma API-avain
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => showTMDBResults(data.results))
    .catch(error => console.error("TMDB Error:", error));
}

function showTMDBResults(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = '';

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

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(overview);
    resultsDiv.appendChild(card);
  });
}

// === FinnKino: teatterit ja aikataulut ===
function fetchFinnkinoTheaters() {
  fetch("https://www.finnkino.fi/xml/TheatreAreas/")
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const theaters = data.getElementsByTagName("TheatreArea");
      const select = document.getElementById("theaterSelect");

      select.innerHTML = '<option value="" disabled selected>Valitse teatteri</option>';

      for (let i = 0; i < theaters.length; i++) {
        const id = theaters[i].getElementsByTagName("ID")[0].textContent;
        const name = theaters[i].getElementsByTagName("Name")[0].textContent;

        // Ohitetaan "Valitse alue" -placeholder
        if (id !== "0") {
          const option = document.createElement("option");
          option.value = id;
          option.textContent = name;
          select.appendChild(option);
        }
      }
    })
    .catch(err => console.error("Finnkino theater fetch error:", err));
}

function fetchFinnkinoSchedule() {
  const theaterId = document.getElementById("theaterSelect").value;
  const url = `https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`;

  fetch(url)
    .then(res => res.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const shows = data.getElementsByTagName("Show");
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = '';

      for (let i = 0; i < shows.length; i++) {
        const title = shows[i].getElementsByTagName("Title")[0].textContent;
        const image = shows[i].getElementsByTagName("EventSmallImagePortrait")[0].textContent;
        const time = shows[i].getElementsByTagName("dttmShowStart")[0].textContent;

        const card = document.createElement("div");
        card.className = "movie-card";

        const titleEl = document.createElement("h3");
        titleEl.textContent = title;

        const img = document.createElement("img");
        img.src = image;

        const timeEl = document.createElement("p");
        timeEl.textContent = new Date(time).toLocaleString('fi-FI');

        card.appendChild(titleEl);
        card.appendChild(img);
        card.appendChild(timeEl);
        resultsDiv.appendChild(card);
      }
    })
    .catch(err => console.error("Finnkino schedule fetch error:", err));
}