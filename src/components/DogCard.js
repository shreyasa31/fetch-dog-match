import React from 'react';
import './DogCard.css';

function DogCard({ dog, toggleFavorite, isFavorite }) {
  return (
    <div className="dog-card">
      <img src={dog.img} alt={dog.name} />
      <h3>{dog.name}</h3>
      <p>Breed: {dog.breed}</p>
      <p>Age: {dog.age}</p>
      <p>Zip: {dog.zip_code}</p>
      <button
        className={isFavorite ? 'unfavorite' : 'favorite'}
        onClick={() => toggleFavorite(dog.id)}
      >
        {isFavorite ? 'Unfavorite' : 'Favorite'}
      </button>
    </div>
  );
}

export default DogCard;
