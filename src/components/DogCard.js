// import React from 'react';
// import './DogCard.css';

// function DogCard({ dog, toggleFavorite, isFavorite }) {
//   return (
//     <div className="dog-card">
//       <img src={dog.img} alt={dog.name} />
//       <h3>{dog.name}</h3>
//       <p>Breed: {dog.breed}</p>
//       <p>Age: {dog.age}</p>
//       <p>Zip: {dog.zip_code}</p>
//       <button
//         className={isFavorite ? 'unfavorite' : 'favorite'}
//         onClick={() => toggleFavorite(dog.id)}
//       >
//         {isFavorite ? 'Unfavorite' : 'Favorite'}
//       </button>
//     </div>
//   );
// }

// export default DogCard;
import React from 'react';
import './DogCard.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function DogCard({ dog, toggleFavorite, isFavorite }) {
  return (
    <div className="dog-card">
      <img src={dog.img} alt={dog.name} />
      <div className="dog-info">
        <h3>{dog.name}</h3>
        <p><strong>Breed:</strong> {dog.breed}</p>
        <p><strong>Age:</strong> {dog.age}</p>
        <p><strong>Zip:</strong> {dog.zip_code}</p>
      </div>

      <button className="fav-icon" onClick={() => toggleFavorite(dog.id)}>
        {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="#444" />}
      </button>
    </div>
  );
}

export default DogCard;
