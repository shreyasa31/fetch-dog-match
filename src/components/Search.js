// Search.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import DogCard from './DogCard';
import Fav from './Fav';
import Confetti from 'react-confetti';
import './Search.css';

function Search() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [from, setFrom] = useState(0);
  const [matchName, setMatchName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const size = 12;
  const [allZips, setAllZips] = useState([]);
  const [zipSuggestions, setZipSuggestions] = useState([]);

  useEffect(() => {
    api.get('/dogs/breeds').then((res) => setBreeds(res.data));

    // api.post('/locations/search', {
    //   size: 1000 // or higher if needed
    // }).then((res) => {
    //   setAllZips(res.data.results.map((loc) => loc.zip_code));
    // });
    
  }, []);
 
  

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, sortOrder, from, zipCode]);

  const fetchDogs = async () => {
    const res = await api.get('/dogs/search', {
      params: {
        breeds: selectedBreed ? [selectedBreed] : undefined,
        // zipCodes: zipCode ? [zipCode] : undefined,
       zipCodes: (zipCode.length === 5 && zipCode) ? [zipCode] : undefined,
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
    if (favorites.length === 0) {
      setMatchName("error:Please add at least one favorite before matching!");
      setShowConfetti(false);
      setTimeout(() => {
        setMatchName("");
      }, 3000);
      return; }
    
    
    const res = await api.post('/dogs/match', favorites);
    const matched = await api.post('/dogs', [res.data.match]);

    setMatchName('');
    setShowConfetti(false);

    setTimeout(() => {
      setMatchName(matched.data[0].name);
      setShowConfetti(true);
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

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="location-input"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => {
                const val = e.target.value;
                setZipCode(val);
                setZipSuggestions(
                  allZips.filter((zip) => zip.startsWith(val)).slice(0, 5)
                );
              }}
              onBlur={() => setTimeout(() => setZipSuggestions([]), 150)}
            />
            {zipSuggestions.length > 0 && (
              <ul className="zip-suggestions">
                {zipSuggestions.map((zip) => (
                  <li key={zip} onClick={() => {
                    setZipCode(zip);
                    setZipSuggestions([]);
                  }}>
                    {zip}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="fav-actions">
            <div className="favorite-count">
              ❤️ {favorites.length}
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

        {dogIds.length >= size && (
  <div className="pagination">
    <button onClick={() => setFrom(Math.max(0, from - size))}>Prev</button>
    <button onClick={() => setFrom(from + size)}>Next</button>
  </div>
)}

       
        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

        {matchName && (
  <div className="match-popup">
    {matchName.startsWith("error:") ? (
      <span style={{ color: 'red' }}>{matchName.replace("error:", "")}</span>
    ) : (
      <>🎉 You got matched with <strong>{matchName}</strong>!</>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default Search;
