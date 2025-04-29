import React, { useEffect, useState } from 'react';
import api from '../api';
import DogCard from './DogCard';
import Fav from './Fav';
import './Search.css';

function Search() {
  console.log("DogCard:", DogCard);
  console.log("Favorites:", Fav);

  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [from, setFrom] = useState(0);
  const size = 10;

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
    alert(`🎉 Your match is: ${matched.data[0].name}`);
  };

  
  return (
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

      <Fav favorites={favorites} getMatch={getMatch} />
    </div>
  );
}

export default Search;
