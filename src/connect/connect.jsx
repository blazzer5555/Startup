import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../app.css';

async function createGame(name, maxPlayers, privacyLevel, passcode) {
    const response = await fetch('/api/connect/host', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            gameName: name,
            maxPlayers: Number(maxPlayers),
            privacyLevel,
            passcode,
        }),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.msg || `Unable to create game (${response.status}).`);
    }
}

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
    const games = getActiveGames();

    return (
        <section className="listed-games">
            <h3>Active Games</h3>
            <table className="active-games-table">
                <thead>
                    <tr>
                        <th>Game Name</th>
                        <th>Host Username</th>
                        <th>Current capacity</th>
                        <th>Privacy Level</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td>{game.name}</td>
                            <td>{game.hostUsername}</td>
                            <td>{game.currentPlayers}/{game.maxPlayers}</td>
                            <td>{game.privacyLevel}</td>
                            <td>
                                <Link to="/play" className="btn btn-primary maroon-button">
                                    Join Game
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {games.length === 0 && (
                        <tr>
                            <td colSpan="5">No active games.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

function getActiveGames() {
    return [
        {
            id: 'n29mowb3',
            name: 'Lol Lmao',
            hostUsername: 'Dimingus',
            currentPlayers: 2,
            maxPlayers: 10,
            privacyLevel: 'Public',
        },
        {
            id: '01pvnb61',
            name: 'Just hop on iN',
            hostUsername: 'Silencce',
            currentPlayers: 1,
            maxPlayers: 4,
            privacyLevel: 'Public',
        },
        {
            id: 'l172vsjd',
            name: 'Sir Thieves',
            hostUsername: 'Aavalos',
            currentPlayers: 5,
            maxPlayers: 5,
            privacyLevel: 'Private',
        },
    ];
}

function getHostedGames() {
    return [
        {
            id: '51vxphbq',
            name: 'Your game',
            maxPlayers: 1,
            privacyLevel: 'Private',
            passcode: '12345',
        },
    ];
}

function ResumeGame() {
    const games = getHostedGames();

    return (
        <section className="listed-games">
            <h3>Your Games</h3>
            <table className="active-games-table">
                <thead>
                    <tr>
                        <th>Game Name</th>
                        <th>Maximum Capacity</th>
                        <th>Privacy Level</th>
                        <th>Passcode</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td>{game.name}</td>
                            <td>{game.maxPlayers}</td>
                            <td>{game.privacyLevel}</td>
                            <td>{game.passcode}</td>
                            <td>
                                <Link to="/play" className="btn btn-primary maroon-button">
                                    Resume Game as Host
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {games.length === 0 && (
                        <tr>
                            <td colSpan="5">You have no hosted games.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

function HostGame() {
    const navigate = useNavigate();
    const [gameName, setGameName] = React.useState('');
    const [maxPlayers, setMaxPlayers] = React.useState('1');
    const [privacyLevel, setPrivacyLevel] = React.useState('public');
    const [passcode, setPasscode] = React.useState('0');
    const [creationError, setCreationError] = React.useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        setCreationError('');
        try {
            await createGame(gameName, maxPlayers, privacyLevel, passcode);
            navigate('/play');
        } catch (error) {
            setCreationError(error.message || 'Unable to create game. Please try again.');
        }
    }

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
        <form className="host-game-input" onSubmit={handleSubmit}>
            <h3>Host Game</h3>
            {creationError && <p role="alert">{creationError}</p>}
            <div className="host-input-field">
                <label className="form-label" htmlFor="game-name">Game Name</label>
                <input
                    id="game-name"
                    className="form-control"
                    placeholder="Game Name"
                    value={gameName}
                    onChange={(event) => setGameName(event.target.value)}
                    required
                />
            </div>
            <div className="host-input-field">
                <label className="form-label" htmlFor="maximum-players">Maximum Players</label>
                <input
                    id="maximum-players"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="form-control"
                    value={maxPlayers}
                    onChange={handleMaxPlayersChange}
                    onBlur={() => setMaxPlayers((value) => value || '1')}
                    required
                />
            </div>
            <div className="host-input-field">
                <label className="form-label" htmlFor="privacy-level">Privacy Level</label>
                <select
                    id="privacy-level"
                    className="form-control"
                    value={privacyLevel}
                    onChange={(event) => setPrivacyLevel(event.target.value)}
                    required
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
            {privacyLevel === 'private' && (
                <div className="host-input-field">
                    <label className="form-label" htmlFor="passcode">Passcode</label>
                    <input
                        id="passcode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="form-control"
                        value={passcode}
                        onChange={handlePasscodeChange}
                        onBlur={() => setPasscode((value) => value || '0')}
                        required
                    />
                </div>
            )}
            <button type="submit" className="btn btn-primary maroon-button align-self-start mt-3">
                Host Game
            </button>
        </form>
    );
}