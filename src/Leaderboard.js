import React, { useState, useEffect } from "react";
import "./Quiz.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className="leaderboard animate__animated animate__bounceIn">
      <h2>🏆 Leaderboard</h2>
      <ol>
        {leaderboard.map((entry, index) => (
          <li key={index}>
            <span className="player-name">{entry.username}</span>
            <span className="player-score">{entry.score} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
