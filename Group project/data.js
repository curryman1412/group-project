fetch('games.json')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("games", JSON.stringify(data.games));
    });
