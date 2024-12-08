document.addEventListener("DOMContentLoaded", () => {
    const games = JSON.parse(localStorage.getItem("games")) || [];
    const gameList = document.getElementById("game-list");
    const pagination = document.getElementById("pagination");
    const searchInput = document.getElementById("gameSearch");

    const itemsPerPage = 20;
    let currentPage = 1;
    let filteredGames = [...games]; // Clone the games array initially.

    // Function to display the games
    const displayGames = (gamesToShow) => {
        gameList.innerHTML = ""; // Clear the current list
        if (gamesToShow.length === 0) {
            gameList.innerHTML = `<p>No games found.</p>`;
            return;
        }

        gamesToShow.forEach((game) => {
            const div = document.createElement("div");
            div.className = "game-item";
            div.innerHTML = `
                <img src="${game.game_image || 'default.jpg'}" alt="${game.game_name.fi}">
                <div>
                    <h3>${game.game_name.fi}</h3>
                    <p>Top Score: ${
                        Math.max(...game.hall_of_fame.map(entry => entry.score))
                    } (${game.hall_of_fame.find(entry => 
                        entry.score === Math.max(...game.hall_of_fame.map(entry => entry.score))
                    ).username})</p>
                </div>`;
            div.addEventListener("click", () => {
                window.location.href = `peli.html?id=${game.ID}`;
            });
            gameList.appendChild(div);
        });
    };

    // Function to handle pagination
    const paginate = () => {
        pagination.innerHTML = ""; // Clear existing pagination buttons
        const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = i === currentPage ? "active" : "";
            button.addEventListener("click", () => {
                currentPage = i;
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                displayGames(filteredGames.slice(start, end));
            });
            pagination.appendChild(button);
        }
    };

    // Search functionality
    searchInput.addEventListener("input", debounce((e) => {
        const query = e.target.value.toLowerCase();
        filteredGames = games.filter(game =>
            game.game_name.fi?.toLowerCase().includes(query)
        );
        currentPage = 1; // Reset to the first page
        displayGames(filteredGames.slice(0, itemsPerPage));
        paginate();
    }, 300));

    // Initial display
    displayGames(filteredGames.slice(0, itemsPerPage));
    paginate();
});

// Debounce function to optimize search
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}