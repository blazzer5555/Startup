import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div>
      <header>
            <h1>THE TREASURE OF MOUNT WIND</h1>
            <nav>
                <a href="./index.html">Home page</a>
                <a href="./login.html">Login page</a>
                <a href="./connect.html">Connection page</a>
                <a href="./play.html">Play page</a>
            </nav>
        </header>

      <main>App components go here</main>

      <footer>
            <div>
                <p>This was made by David Bassett</p>
                <a href="https://github.com/blazzer5555/Startup"
                    class="github-link">link to my github</a>
            </div>
        </footer>
    </div>
  );
}