import React from 'react';
import { Link } from 'react-router-dom';
import '../app.css';

export function Connect() {
    const [activeSection, setActiveSection] = React.useState(null);

    return (
        <main>
            <section className="connect-menu-buttons">
                <button
                    type="button"
                    className="btn btn-primary maroon-button align-self-center"
                    onClick={() => setActiveSection('listGames')}
                >
                    List Games
                </button>
                <button
                    type="button"
                    className="btn btn-primary maroon-button align-self-center"
                    onClick={() => setActiveSection('HostGame')}
                >
                    Host Game
                </button>
            </section>
            {activeSection === 'listGames' && <section className="listed-games">
                <h3>Active games</h3>
                <table className="active-games-table">
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
                        <td><Link to="/play" className="btn btn-primary maroon-button">
                            Join Game
                        </Link></td>
                    </tr>
                    <tr>
                        <td>Just hop on iN</td>
                        <td>Silencce</td>
                        <td>1/4</td>
                        <td><Link to="/play" className="btn btn-primary maroon-button">
                            Join Game
                        </Link></td>
                    </tr>
                    <tr>
                        <td>Sir Thieves</td>
                        <td>Aavalos</td>
                        <td>5/5</td>
                        <td><Link to="/play" className="btn btn-primary maroon-button">
                            Join Game
                        </Link></td>
                    </tr>
                </table>
            </section>}
            {activeSection === 'HostGame' && <section className="host-game-input">
                <h3>Host game</h3>
                <div className="host-input-fields">
                    <label className="form-label">Game Name</label>
                    <input
                        className="form-control w-25"
                        placeholder="Game Name"></input>
                    <label className="form-label">Maximum Players</label>
                    <input
                        className="form-control w-25"
                        placeholder="Max"></input>
                </div>
                <Link to="/play" className="btn btn-primary maroon-button align-self-start mt-3">
                    Host Game
                </Link>
            </section>}
        </main>
    );
}