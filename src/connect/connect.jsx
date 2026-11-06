import React from 'react';
import { useNavigate } from 'react-router-dom';
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

async function submitGameAction(endpoint, gameName, passcode) {
    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ gameName, passcode }),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.msg || `Game request failed (${response.status}).`);
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
    const [games, setGames] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState('');

    React.useEffect(() => {
        getActiveGames()
            .then(setGames)
            .catch((error) => setLoadError(error.message || 'Unable to load games.'))
            .finally(() => setLoading(false));
    }, []);

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
                    {loading && (
                        <tr><td colSpan="5">Loading games...</td></tr>
                    )}
                    {loadError && (
                        <tr><td colSpan="5" role="alert">{loadError}</td></tr>
                    )}
                    {!loading && !loadError && games.map((game, index) => (
                        <tr key={game.id || `${game.gameName}-${game.host}-${index}`}>
                            <td>{game.gameName}</td>
                            <td>{game.host}</td>
                            <td>{game.currentPlayers ?? 'N/A'}/{game.maxPlayers}</td>
                            <td>{game.privacyLevel}</td>
                            <td><JoinGameAction game={game} /></td>
                        </tr>
                    ))}
                    {!loading && !loadError && games.length === 0 && (
                        <tr>
                            <td colSpan="5">No active games.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

function JoinGameAction({ game }) {
    const navigate = useNavigate();
    const [passcode, setPasscode] = React.useState('');
    const [showPasscode, setShowPasscode] = React.useState(false);
    const [joining, setJoining] = React.useState(false);
    const [joinError, setJoinError] = React.useState('');
    const isPrivate = String(game.privacyLevel).toLowerCase() === 'private';

    async function handleJoin(event) {
        event.preventDefault();
        if (isPrivate && !showPasscode) {
            setShowPasscode(true);
            return;
        }

        setJoining(true);
        setJoinError('');
        try {
            await submitGameAction('/api/connect/join', game.gameName, passcode);
            navigate('/play');
        } catch (error) {
            setJoinError(error.message || 'Unable to join game.');
        } finally {
            setJoining(false);
        }
    }

    return (
        <form onSubmit={handleJoin}>
            {isPrivate && showPasscode && (
                <input
                    type="password"
                    className="form-control mb-2"
                    aria-label={`Passcode for ${game.gameName}`}
                    placeholder="Passcode"
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value)}
                    required
                />
            )}
            <button type="submit" className="btn btn-primary maroon-button" disabled={joining}>
                {joining ? 'Joining...' : 'Join Game'}
            </button>
            {joinError && <p role="alert">{joinError}</p>}
        </form>
    );
}

async function fetchGames(endpoint) {
    const response = await fetch(endpoint, { credentials: 'include' });
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.msg || `Unable to load games (${response.status}).`);
    }
    if (!Array.isArray(result)) {
        throw new Error('The server returned an invalid games list.');
    }

    return result;
}

function getActiveGames() {
    return fetchGames('/api/connect/games');
}

function getHostedGames() {
    return fetchGames('/api/connect/hosted');
}

function ResumeGame() {
    const [games, setGames] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState('');

    React.useEffect(() => {
        getHostedGames()
            .then(setGames)
            .catch((error) => setLoadError(error.message || 'Unable to load your games.'))
            .finally(() => setLoading(false));
    }, []);

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
                    {loading && (
                        <tr><td colSpan="5">Loading your games...</td></tr>
                    )}
                    {loadError && (
                        <tr><td colSpan="5" role="alert">{loadError}</td></tr>
                    )}
                    {!loading && !loadError && games.map((game, index) => (
                        <tr key={game.id || `${game.gameName}-${index}`}>
                            <td>{game.gameName}</td>
                            <td>{game.maxPlayers}</td>
                            <td>{game.privacyLevel}</td>
                            <td>{game.passcode}</td>
                            <td><ResumeGameAction game={game} /></td>
                        </tr>
                    ))}
                    {!loading && !loadError && games.length === 0 && (
                        <tr>
                            <td colSpan="5">You have no hosted games.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}

function ResumeGameAction({ game }) {
    const navigate = useNavigate();
    const [resuming, setResuming] = React.useState(false);
    const [resumeError, setResumeError] = React.useState('');

    async function handleResume() {
        setResuming(true);
        setResumeError('');
        try {
            await submitGameAction('/api/connect/resume', game.gameName);
            navigate('/play');
        } catch (error) {
            setResumeError(error.message || 'Unable to resume game.');
        } finally {
            setResuming(false);
        }
    }

    return (
        <>
            <button
                type="button"
                className="btn btn-primary maroon-button"
                onClick={handleResume}
                disabled={resuming}
            >
                {resuming ? 'Resuming...' : 'Resume Game as Host'}
            </button>
            {resumeError && <p role="alert">{resumeError}</p>}
        </>
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