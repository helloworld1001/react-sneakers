import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { useContext } from 'react';
import AppContext from '../context';

function Orders() {
  const { cartItems } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      (async () => {
        const { data } = await axios.get('https://645809010c15cb148216d4a7.mockapi.io/orders');
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      })();
    } catch (error) {
      throw new Error('Data have not recieved');
    }
  }, []);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>

      <div className="d-flex flex-wrap">
        {(isLoading ? [...Array(8)] : orders).map((item, index) => (
          <Card
            key={index}
            added={cartItems.some(cartItem => cartItem.title === item.title)}
            loading={isLoading}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}

export default Orders;
