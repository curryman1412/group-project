document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get("id"));
    const games = JSON.parse(localStorage.getItem("games"));
    const game = games.find(g => g.ID === gameId);

    // Asetetaan pelin nimi, kuva ja kuvaus
    document.getElementById("game-title").textContent = game.game_name.fi;
    document.getElementById("game-image").src = game.game_image || 'default.jpg';
    document.getElementById("game-description").textContent = game.description.fi;

    // Haetaan ja lajitellaan pelaajat
    const players = game.hall_of_fame.sort((a, b) => b.score - a.score);
    const scoreTable = document.querySelector("#score-table tbody");

    // Korostusluokat parhaimmille pisteille
    const getHighlightClass = (rank) => {
        if (rank === 1) return "gold";
        if (rank === 2) return "silver";
        if (rank === 3) return "bronze";
        return "";
    };

    // Näytetään pelaajat taulukossa
    const displayPlayers = (filteredPlayers) => {
        scoreTable.innerHTML = "";
        filteredPlayers.forEach((player, index) => {
            const tr = document.createElement("tr");
            tr.className = getHighlightClass(index + 1);
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.score}</td>
                <td>${new Date(player.date_time).toLocaleDateString()}</td>`;
            scoreTable.appendChild(tr);
        });
    };

    // Hakutoiminto pelaajan nimelle
    document.getElementById("playerSearch").addEventListener("input", debounce((e) => {
        const filteredPlayers = players.filter(player =>
            player.username.toLowerCase().includes(e.target.value.toLowerCase())
        );
        displayPlayers(filteredPlayers);
    }, 300));

    // Näytä kaikki pelaajat alkuun
    displayPlayers(players);
});

// Debounce-funktio
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
