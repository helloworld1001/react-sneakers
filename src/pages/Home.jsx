import Card from '../components/Card';

function Home({ isLoading, items, searchValue, setSearchValue, onChangeSearhcInput, onAddToCart, onAddToFavorite }) {
  const renderItems = () => {
    const filtredItems = items.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
    return (isLoading ? [...Array(12)] : filtredItems).map((item, index) => (
      <Card
        key={index}
        onPlus={obj => {
          onAddToCart(obj);
        }}
        onFavorite={obj => onAddToFavorite(obj)}
        loading={isLoading}
        {...item}
      />
    ));
  };
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
        <div className="search-block d-flex">
          <img src="/img/search.svg" alt="search" />
          {searchValue && (
            <img onClick={() => setSearchValue('')} className="clear cu-p" src="/img/btn-remove.svg" alt="clear" />
          )}
          <input onChange={onChangeSearhcInput} value={searchValue} type="text" placeholder="Поиск..." />
        </div>
      </div>
      <div className="d-flex flex-wrap">{renderItems()}</div>
    </div>
  );
}

export default Home;
