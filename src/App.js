import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from './context';
import Orders from './pages/Orders';

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://64529a2fa2860c9ed410d3c4.mockapi.io/cart'),
          axios.get('https://645809010c15cb148216d4a7.mockapi.io/favorites'),
          axios.get('https://64529a2fa2860c9ed410d3c4.mockapi.io/items'),
        ]);

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при добавлении в корзину');
      }
    }

    fetchData();
  }, []);

  const onRemoveItem = id => {
    try {
      axios.delete(`https://64529a2fa2860c9ed410d3c4.mockapi.io/cart/${id}`);
      setCartItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      alert('Ошибка при удалении из корзины');
    }
  };

  const onAddToFavorite = async obj => {
    try {
      if (favorites.find(item => item.id === obj.id)) {
        axios.delete(`https://645809010c15cb148216d4a7.mockapi.io/favorites/${obj.id}`);
        setFavorites(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
      } else {
        let { data } = await axios.post('https://645809010c15cb148216d4a7.mockapi.io/favorites', obj);

        setFavorites(prev => [...prev, data]);
      }
    } catch (err) {
      alert('Ошибка при добавлении в Избранное');
    }
  };

  const onAddToCart = async obj => {
    try {
      const findedItem = cartItems.find(item => item.parentId === obj.id);
      if (findedItem) {
        setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://64529a2fa2860c9ed410d3c4.mockapi.io/cart/${findedItem.id}`);
      } else {
        const { data } = await axios.post('https://64529a2fa2860c9ed410d3c4.mockapi.io/cart', obj);
        setCartItems(prev => [...prev, data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSearhcInput = event => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = id => {
    return cartItems.some(cartItem => cartItem.parentId === id);
  };
  return (
    <AppContext.Provider
      value={{ items, cartItems, favorites, onAddToFavorite, onAddToCart, setCartOpened, setCartItems, isItemAdded }}
    >
      <div className="wrapper clear">
        <Drawer onRemove={onRemoveItem} onCloseCart={() => setCartOpened(false)} opened={cartOpened} />
        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path=""
            element={
              <Home
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearhcInput={onChangeSearhcInput}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
                isLoading={isLoading}
              />
            }
          />
          <Route path="favorites" element={<Favorites />} />
          <Route path="orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
