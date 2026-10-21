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
                    onClick={() => setActiveSection('hostGame')}
                >
                    Host New Game
                </button>
                <button
                    type="button"
                    className="btn btn-primary maroon-button align-self-center"
                    onClick={() => setActiveSection('resumeGame')}
                >
                    Resume Game
                </button>
            </section>
            {activeSection === 'listGames' && <ListGames />}
            {activeSection === 'hostGame' && <HostGame />}
            {activeSection === 'resumeGame' && <ResumeGame />}
        </main>
    );
}

function ListGames() {
    return (
        <section className="listed-games">
            <h3>Active games</h3>
            <table className="active-games-table">
                <tr>
                    <th>Game Name</th>
                    <th>Host Username</th>
                    <th>Current capacity</th>
                    <th>Privacy Level</th>
                    <th></th>
                </tr>
                <tr>
                    <td>Lol Lmao</td>
                    <td>Dimingus</td>
                    <td>2/10</td>
                    <td>Public</td>
                    <td><Link to="/play" className="btn btn-primary maroon-button">
                        Join Game
                    </Link></td>
                </tr>
                <tr>
                    <td>Just hop on iN</td>
                    <td>Silencce</td>
                    <td>1/4</td>
                    <td>Public</td>
                    <td><Link to="/play" className="btn btn-primary maroon-button">
                        Join Game
                    </Link></td>
                </tr>
                <tr>
                    <td>Sir Thieves</td>
                    <td>Aavalos</td>
                    <td>5/5</td>
                    <td>Private</td>
                    <td><Link to="/play" className="btn btn-primary maroon-button">
                        Join Game
                    </Link></td>
                </tr>
            </table>
        </section>
    );
}

function ResumeGame() {
    return (
        <section className="listed-games">
            <h3>Your Games</h3>
            <table className="active-games-table">
                <tr>
                    <th>Game Name</th>
                    <th>Maximum Capacity</th>
                    <th>Privacy Level</th>
                    <th>Passcode</th>
                    <th></th>
                </tr>
                <tr>
                    <td>User's game</td>
                    <td>1</td>
                    <td>Private</td>
                    <td>12345</td>
                    <td><Link to="/play" className="btn btn-primary maroon-button">
                        Resume Game as Host
                    </Link></td>
                </tr>
            </table>
        </section>
    );
}

function HostGame() {
    const [maxPlayers, setMaxPlayers] = React.useState('1');
    const [privacyLevel, setPrivacyLevel] = React.useState('public');
    const [passcode, setPasscode] = React.useState('0');

    function handleMaxPlayersChange(event) {
        const digits = event.target.value.replace(/\D/g, '');
        if (!digits) {
            setMaxPlayers('');
            return;
        }

        setMaxPlayers(String(Math.min(10, Math.max(1, Number(digits)))));
    }

    function handlePasscodeChange(event) {
        const digits = event.target.value.replace(/\D/g, '');
        if (!digits) {
            setPasscode('');
            return;
        }

        setPasscode(String(Math.min(99999, Number(digits))));
    }

    return (
        <section className="host-game-input">
            <h3>Host game</h3>
            <div className="host-input-field">
                <label className="form-label">Game Name</label>
                <input
                    className="form-control w-25"
                    placeholder="Game Name"></input>
            </div>
            <div className="host-input-field">
                <label className="form-label">Maximum Players</label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control w-25"
                    value={maxPlayers}
                    onChange={handleMaxPlayersChange}
                    onBlur={() => setMaxPlayers((value) => value || '1')}
                    required
                />
            </div>
            <div className="host-input-field">
                <label className="form-label">Privacy Level</label>
                <select
                    className="form-control w-25"
                    value={privacyLevel}
                    onChange={(event) => setPrivacyLevel(event.target.value)}
                    required
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div className="host-input-field">
                <label className="form-label">Passcode</label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control w-25"
                    value={passcode}
                    onChange={handlePasscodeChange}
                    onBlur={() => setPasscode((value) => value || '0')}
                    disabled={privacyLevel === 'public'}
                    required={privacyLevel === 'private'}
                />
            </div>
            <Link to="/play" className="btn btn-primary maroon-button align-self-start mt-3">
                Host Game
            </Link>
        </section>
    );
}