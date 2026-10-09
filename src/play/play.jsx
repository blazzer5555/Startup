import React from 'react';
import '.././app.css';

export function Play() {
    return (
        <main class="game-layout">
            <aside class="game-actions" aria-label="Game actions">
                <div class="game-action-list">
                    <button type="button" class="btn btn-outline-dark">Roll
                        D20</button>
                    <button type="button" class="btn btn-outline-dark">Enemy
                        Roll</button>
                    <button type="button" class="btn btn-outline-dark">Draw
                        Blow</button>
                    <button type="button" class="btn btn-outline-dark">Hurt
                        Blow</button>
                    <button type="button"
                        class="btn btn-outline-dark">Intelligence Check</button>
                    <button type="button" class="btn btn-outline-dark">Courage
                        Check</button>
                </div>
                <a href="./connect.html"
                    class="btn btn-primary maroon-button" id="exit-game">
                    Exit Game
                </a>
            </aside>
            <section class="game-view" aria-label="Game view">
                <h2>VIEWFINDER</h2>
                <div class="map-marker">Lantern</div>
            </section>
            <aside class="game-sidebar" aria-label="Character information">
                <section class="game-stats">
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
                <section class="game-equipment">
                    <h2>Equipped Items</h2>
                    <ul>
                        <li>Chainmail <span>+2 Toughness</span></li>
                        <li>Plated Leggings <span>+1 Toughness</span></li>
                        <li>Greatsword <span>+3 Strength</span></li>
                        <li>Helmet of Wisdom <span>+2 Intelligence</span></li>
                    </ul>
                </section>
                <section class="game-inventory">
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