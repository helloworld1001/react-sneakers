import styles from './Drawer.module.scss';

import { useState } from 'react';
import Info from '../info';
import axios from 'axios';
import { useCart } from '../../hooks/useCart';

const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

function Drawer({ onCloseCart, onRemove, opened }) {
  const { cartItems, setCartItems, totalPrice, tax } = useCart();
  const [orderId, setOrderId] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post('https://645809010c15cb148216d4a7.mockapi.io/orders', { items: cartItems });

      setOrderId(data.id);
      setIsOrderComplete(true);

      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        await axios.delete(`https://64529a2fa2860c9ed410d3c4.mockapi.io/cart/${cartItems[i].id}`);
        delay(1000);
      }
    } catch (error) {
      alert('Не удалось создать заказ :(');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30 ">
          Корзина
          <img onClick={onCloseCart} className="removeBtn cu-p" src="img/btn-remove.svg" alt="remove" />
        </h2>

        {cartItems.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items flex">
              {cartItems.map(obj => (
                <div key={obj.id} className="cartItem d-flex align-center mb-20">
                  <div style={{ backgroundImage: `url(${obj.imageUrl})` }} className="cartItemImg"></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>
                  <img onClick={() => onRemove(obj.id)} className="removeBtn" src="img/btn-remove.svg" alt="remove" />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>
                <li>
                  <span>Налог 5%</span>
                  <div></div>
                  <b>{tax} руб.</b>
                </li>
              </ul>
              <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
                Оформить заказ <img src="img/arrow.svg" alt="arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? 'Заказ оформлен' : 'Корзина пустая'}
            description={
              isOrderComplete
                ? `Ваш заказ №${orderId} скоро будет передан курьеру`
                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
            }
            image={isOrderComplete ? 'img/complete-order.jpg' : 'img/empty-cart.jpg'}
          />
        )}
      </div>
      ;
    </div>
  );
}

export default Drawer;
