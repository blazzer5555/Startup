import React from 'react';
import { Link } from 'react-router-dom';
import '../app.css';

export function Home() {
    const [scenery, setScenery] = React.useState(null);
    const [sceneryError, setSceneryError] = React.useState('');

    React.useEffect(() => {
        const controller = new AbortController();

        async function loadScenery() {
            try {
                const response = await fetch('/api/scenery', { signal: controller.signal });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.msg || 'Unable to load the scenery image.');
                }

                setScenery(result);
            } catch (error) {
                if (!controller.signal.aborted) {
                    setSceneryError(error.message || 'Unable to load the scenery image.');
                }
            }
        }

        loadScenery();
        return () => controller.abort();
    }, []);

    return (
        <main
            className="home-page"
            style={scenery ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("${scenery.imageUrl}")`,
            } : undefined}
        >
            <section className="home-card">
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
                <Link to="/login" className="btn btn-primary maroon-button">
                    Login or Register
                </Link>
            </section>
            {scenery && (
                <p className="photo-credit">
                    Photo by <a href={scenery.photographerUrl} target="_blank" rel="noreferrer">
                        {scenery.photographerName}
                    </a>{' '}
                    on <a href={scenery.photoPageUrl} target="_blank" rel="noreferrer">Unsplash</a>
                </p>
            )}
            {sceneryError && <p className="scenery-error" role="status">{sceneryError}</p>}
        </main>
    );
}