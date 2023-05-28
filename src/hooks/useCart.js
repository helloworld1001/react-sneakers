import { useContext } from 'react';
import AppContext from '../context';

export const useCart = () => {
  const { cartItems, setCartItems } = useContext(AppContext);
  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);
  const tax = Math.floor(totalPrice * 0.05 * 100) / 100;

  return { cartItems, setCartItems, totalPrice, tax };
};
