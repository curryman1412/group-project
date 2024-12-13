document.addEventListener("DOMContentLoaded", () => {
    const games = JSON.parse(localStorage.getItem("games"));
    const gameList = document.getElementById("game-list");
    const pagination = document.getElementById("pagination");
    const searchInput = document.getElementById("gameSearch");

    const itemsPerPage = 20;
    let currentPage = 1;

    const displayGames = (gamesToShow) => {
        gameList.innerHTML = "";
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

    const paginate = () => {
        const totalPages = Math.ceil(games.length / itemsPerPage);
        pagination.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.addEventListener("click", () => {
                currentPage = i;
                displayGames(games.slice((i - 1) * itemsPerPage, i * itemsPerPage));
            });
            pagination.appendChild(button);
        }
    };

    searchInput.addEventListener("input", debounce((e) => {
        const filteredGames = games.filter(game =>
            game.game_name.fi.toLowerCase().includes(e.target.value.toLowerCase())
        );
        displayGames(filteredGames.slice(0, itemsPerPage));
        paginate();
    }, 300));

    displayGames(games.slice(0, itemsPerPage));
    paginate();
});

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
