fetch('games.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched data:", data);
        localStorage.setItem("games", JSON.stringify(data.games));
    })
    .catch(error => {
        console.error("Error fetching games.json:", error);
    });