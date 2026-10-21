import React from 'react';
import '../app.css';

export function Play() {
    const [terminalMessages, setTerminalMessages] = React.useState([]);
    const terminalRef = React.useRef(null);

    React.useLayoutEffect(() => {
        const terminal = terminalRef.current;
        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    }, [terminalMessages]);

    React.useEffect(() => {
        const intervalId = window.setInterval(() => {
            setTerminalMessages((messages) => [
                ...messages,
                "(Websocket connection) The connected player rolled a 1. That's so sad.",
            ]);
        }, 10000);

        return () => window.clearInterval(intervalId);
    }, []);

    function MakeDieRoll() {
        const roll = Math.floor(Math.random() * 20) + 1;
        setTerminalMessages((messages) => [...messages, `Rolled a ${roll}`]);
    }

    function MakeOtherDieRoll() {
        setTerminalMessages((messages) => [
            ...messages,
            'Not sure if these buttons will be in the final product',
        ]);
    }

    return (
        <main className="game-layout">
            <aside className="game-actions" aria-label="Game actions">
                <div className="game-action-list">
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={MakeDieRoll}
                    >
                        Roll D20
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={MakeOtherDieRoll}
                    >
                        Enemy Roll
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={MakeOtherDieRoll}
                    >
                        Draw Blow
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={MakeOtherDieRoll}
                    >
                        Hurt Blow
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={MakeOtherDieRoll}
                    >
                        Intelligence Check
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={MakeOtherDieRoll}
                    >
                        Courage Check
                    </button>
                </div>
            </aside>
            <section className="game-view" aria-label="Game view">
                <h2>VIEWFINDER</h2>
                <div className="map-marker">Lantern</div>
                <section
                    ref={terminalRef}
                    className="game-terminal"
                    aria-label="Game terminal"
                    aria-live="polite"
                >
                    {terminalMessages.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                </section>
            </section>
            <aside className="game-sidebar" aria-label="Character information">
                <section className="game-stats">
                    <h2>Character Stats</h2>
                    <dl>
                        <div><dt>Strength</dt><dd>10</dd></div>
                        <div><dt>Toughness</dt><dd>12</dd></div>
                        <div><dt>Intelligence</dt><dd>8</dd></div>
                        <div><dt>Courage</dt><dd>7</dd></div>
                        <div><dt>Might</dt><dd>3</dd></div>
                        <div><dt>Fate</dt><dd>3</dd></div>
                    </dl>
                </section>
                <section className="game-equipment">
                    <h2>Equipped Items</h2>
                    <ul>
                        <li>Chainmail <span>+2 Toughness</span></li>
                        <li>Plated Leggings <span>+1 Toughness</span></li>
                        <li>Greatsword <span>+3 Strength</span></li>
                        <li>Helmet of Wisdom <span>+2 Intelligence</span></li>
                    </ul>
                </section>
                <section className="game-inventory">
                    <h2>Inventory</h2>
                    <ul>
                        <li>Lantern</li>
                        <li>Might Flask</li>
                        <li>Resurrection Phial</li>
                        <li>Rope</li>
                        <li>Golden Key</li>
                    </ul>
                </section>
            </aside>
        </main>
    );
}