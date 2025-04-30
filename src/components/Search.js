

import React, { useEffect, useState } from 'react';
import api from '../api';
import DogCard from './DogCard';
import Fav from './Fav';
import './Search.css';
import Confetti from 'react-confetti';



function Search() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [from, setFrom] = useState(0);
  const [matchName, setMatchName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  // const [width, height] = useWindowSize();

  const size = 12;

  useEffect(() => {
    api.get('/dogs/breeds').then((res) => setBreeds(res.data));
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, sortOrder, from]);

  const fetchDogs = async () => {
    const res = await api.get('/dogs/search', {
      params: {
        breeds: selectedBreed ? [selectedBreed] : undefined,
        sort: `breed:${sortOrder}`,
        size,
        from,
      },
    });
    setDogIds(res.data.resultIds);
    const dogData = await api.post('/dogs', res.data.resultIds);
    setDogs(dogData.data);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const getMatch = async () => {
    const res = await api.post('/dogs/match', favorites);
    const matched = await api.post('/dogs', [res.data.match]);
  
    // Reset to force re-render if same name
    setMatchName('');
    setShowConfetti(false);
  
    setTimeout(() => {
      setMatchName(matched.data[0].name);
      setShowConfetti(true);
  
      // Auto-hide after 4 seconds
      setTimeout(() => {
        setMatchName('');
        setShowConfetti(false);
      }, 4000);
    }, 10);
  };
  
  
  return (
    <div className="search-bg">
      <div className="search-page">
        <div className="controls">
          <select onChange={(e) => setSelectedBreed(e.target.value)}>
            <option value="">All Breeds</option>
            {breeds.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            Sort: {sortOrder}
          </button>

          <div className="fav-actions">
            <div className="favorite-count">
              <span role="img" aria-label="heart">❤️</span> {favorites.length}
            </div>
            <button className="match-btn" onClick={getMatch}>
              Match Me
            </button>
          </div>
        </div>

        <div className="dog-list">
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(dog.id)}
            />
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => setFrom(Math.max(0, from - size))}>Prev</button>
          <button onClick={() => setFrom(from + size)}>Next</button>
        </div>
        {showConfetti && (
  <Confetti width={window.innerWidth} height={window.innerHeight} />
)}


{matchName && (
  <div className="match-popup">
    🎉 You got matched with <strong>{matchName}</strong>!
  </div>
)}




      </div>
    </div>
  );
}

export default Search;
