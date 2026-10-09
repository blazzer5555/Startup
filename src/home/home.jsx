import React from 'react';
import '../app.css';

export function Home() {
    return (
        <main>
            <div>
                <p className="intro">
                    Welcome to Mount Wind! The fabled mountain holds an
                    experience unlike any other. Use your skills,
                    your wits, and your luck as you traverse the mountain. Will
                    you be the one to go farther than any other,
                    traversing the depths of the caves, or perhaps climbing the
                    highest peaks, or will you be like the many
                    others that have come before you to have their hopes and
                    lives swallowed in the soul of the mountain?
                </p>
            </div>
            <a href="./login.html"
                className="btn btn-primary maroon-button align-self-center">
                Login or Register
            </a>
        </main>
    );
}