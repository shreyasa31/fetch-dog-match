import React from 'react';
import './Fav.css';

function Fav({ favorites, getMatch }) {
  return (
    <div className="favorites-box">
      <h3>Favorites Count: {favorites.length}</h3>
      <button onClick={getMatch} disabled={favorites.length === 0}>
        Match Me!
      </button>
    </div>
  );
}

export default Fav;
