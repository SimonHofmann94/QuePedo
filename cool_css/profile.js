import React from 'react';
import styled from 'styled-components';

const Card = () => {
    return (
        <StyledWrapper>
            <div className="card-container">
                <div className="comic-card" role="article" aria-labelledby="card-username">
                    <div className="card-header">
                        <div className="card-avatar" />
                        <div className="card-user-info">
                            <p className="card-username" id="card-username">Captain Creative</p>
                            <p className="card-handle">@TheInker</p>
                        </div>
                    </div>
                    <div className="card-content">
                        <div className="card-image-container" />
                        <p className="card-caption">
                            MEANWHILE... I've discovered a new source of ultimate creative power!
                        </p>
                    </div>
                    <div className="card-actions">
                        <button className="action-button like-button" aria-label="Like Post">
                            <svg className="action-button-icon" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                        <button className="action-button comment-button" aria-label="Comment on Post">
                            <svg className="action-button-icon" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>
                        <button className="action-button share-button" aria-label="Share Post">
                            <svg className="action-button-icon" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
    font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  }

  .comic-card {
    --paper-white: #fefae8;
    --primary-yellow: #ffd900;
    --accent-red: #d92b2b;
    --accent-blue: #2b80d9;
    --ink-black: #212121;
    --border-stroke: 0.15em;
    --dot-color: rgba(0, 0, 0, 0.2);

    position: relative;
    display: flex;
    flex-direction: column;
    width: 18em;
    max-width: 333px;
    max-height: 444px;
    background-color: var(--paper-white);
    border: var(--border-stroke) solid var(--ink-black);
    border-radius: 0.5em;
    padding: 1em;
    box-shadow: 0.5em 0.5em 0 var(--ink-black);
    transition:
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.2s ease;
    transform-origin: bottom left;
  }

  .comic-card:hover {
    transform: translateY(-0.6em) rotate(-2deg);
    box-shadow: 0.8em 0.8em 0 0.1em var(--accent-red);
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.8em;
  }

  .card-avatar {
    width: 3.5em;
    height: 3.5em;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-blue), #6ba9e4);
    border: var(--border-stroke) solid var(--ink-black);
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  .comic-card:hover .card-avatar {
    transform: scale(1.1);
  }

  .card-user-info {
    margin-left: 0.8em;
    text-transform: uppercase;
  }

  .card-username {
    margin: 0;
    font-size: 1.2em;
    font-weight: 300;
    color: var(--ink-black);
    background-color: var(--primary-yellow);
    padding: 0.1em 0.5em;
    clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
    letter-spacing: 1px;
  }

  .card-handle {
    margin: 0.2em 0 0 0;
    font-size: 0.8em;
    color: var(--ink-black);
    font-weight: 100;
    letter-spacing: 2px;
  }

  .card-content {
    flex-grow: 1;
  }

  .card-image-container {
    width: 100%;
    height: 9em;
    border-radius: 0.2em;
    border: var(--border-stroke) solid var(--ink-black);
    overflow: hidden;
    background-color: var(--accent-blue);
    background-image: radial-gradient(
      circle,
      var(--dot-color) 0.05em,
      transparent 0.05em
    );
    background-size: 0.5em 0.5em;
    background-position:
      0 0,
      0.25em 0.25em;
    transition: transform 0.3s ease;
  }

  .comic-card:hover .card-image-container {
    transform: skewX(-3deg) scale(1.02);
  }

  .card-caption {
    position: relative;
    margin: 0.8em 0;
    padding: 0.6em 0.8em;
    background-color: var(--paper-white);
    border: var(--border-stroke) solid var(--ink-black);
    border-radius: 0.5em;
    font-size: 0.9em;
    line-height: 1.3;
    color: var(--ink-black);
  }

  .card-caption::after {
    content: "";
    position: absolute;
    bottom: -0.6em;
    left: 1.5em;
    width: 0;
    height: 0;
    border: 0.5em solid var(--ink-black);
    border-color: var(--ink-black) transparent transparent transparent;
  }

  .card-caption::before {
    content: "";
    position: absolute;
    bottom: -0.4em;
    left: 1.6em;
    width: 0;
    height: 0;
    border: 0.4em solid var(--paper-white);
    border-color: var(--paper-white) transparent transparent transparent;
  }

  .card-actions {
    display: flex;
    justify-content: space-around;
    margin-top: auto;
    padding-top: 0.5em;
  }

  .action-button {
    background-color: var(--primary-yellow);
    border: var(--border-stroke) solid var(--ink-black);
    padding: 0.5em;
    cursor: pointer;
    border-radius: 0.5em;
    box-shadow: 0.2em 0.2em 0 var(--ink-black);
    transition:
      transform 0.1s ease,
      box-shadow 0.1s ease,
      background-color 0.2s ease;
  }

  .action-button:hover {
    background-color: var(--accent-red);
  }

  .action-button:active {
    transform: translate(0.2em, 0.2em);
    box-shadow: none;
  }

  .action-button-icon {
    width: 1.3em;
    height: 1.3em;
    stroke-width: 3;
    stroke: var(--ink-black);
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    display: block;
  }

  .action-button:hover .action-button-icon {
    stroke: var(--paper-white);
  }

  .like-button:hover .action-button-icon {
    fill: var(--paper-white);
  }`;

export default Card;
