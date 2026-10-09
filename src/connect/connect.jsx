import React from 'react';
import '.././app.css';

export function Connect() {
    return (
        <main>
            <section class="connect-menu-buttons">
                <a class="btn btn-primary maroon-button align-self-center">
                    List Games
                </a>
                <a class="btn btn-primary maroon-button align-self-center">
                    Host Game
                </a>
            </section>
            <section class="listed-games">
                <h3>Active games (What would appear if the user clicked
                    "List Games")</h3>
                <table class="active-games-table">
                    <tr>
                        <th>Game Name</th>
                        <th>Host Username</th>
                        <th>Current capacity</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>Lol Lmao</td>
                        <td>Dimingus</td>
                        <td>2/10</td>
                        <td><a href="./play.html"
                            class="btn btn-primary maroon-button">
                            Join Game
                        </a></td>
                    </tr>
                    <tr>
                        <td>Just hop on iN</td>
                        <td>Silencce</td>
                        <td>1/4</td>
                        <td><a href="./play.html"
                            class="btn btn-primary maroon-button">
                            Join Game
                        </a></td>
                    </tr>
                    <tr>
                        <td>Sir Thieves</td>
                        <td>Aavalos</td>
                        <td>5/5</td>
                        <td><a href="./play.html"
                            class="btn btn-primary maroon-button">
                            Join Game
                        </a></td>
                    </tr>
                </table>
                <div>
                    <p>
                        *This is information the server would serve from the
                        database*
                    </p>
                </div>
            </section>
            <section class="host-game-input">
                <h3>Host game (What would appear if the user clicked
                    "Host Game")</h3>
                <div class="host-input-fields">
                    <label class="form-label">Game Name</label>
                    <input
                        class="form-control w-25"
                        placeholder="Game Name"></input>
                    <label class="form-label">Maximum Players</label>
                    <input
                        class="form-control w-25"
                        placeholder="Max"></input>
                </div>
                <a href="./play.html"
                    class="btn btn-primary maroon-button align-self-start mt-3">
                    Host Game
                </a>
            </section>

        </main>
    );
}