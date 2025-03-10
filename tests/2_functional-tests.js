const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const apiUrl = 'https://3000-freecodecam-boilerplate-tqy93zi685p.ws-eu118.gitpod.io/api/stock-prices/';

suite('Functional Tests:', function() {

  //use .then structure
  test('Viewing one stock', () => {
    return fetch(apiUrl + '?stock=AAPL')
    .then(response => response.json())
    .then(json => {
      console.log('json:', json.stockData);
      assert.equal(json.stockData.stock, 'AAPL', 'Failure viewing one stock (wrong stock symbol)');
      assert.exists(json.stockData.price, 'Failure viewing one stock (missing price)');
      assert.typeOf(json.stockData.price, 'number', 'Failure viewing one stock (price is not a number)');
      assert.exists(json.stockData.likes, 'Failure viewing one stock (missing likes)');
      assert.typeOf(json.stockData.likes, 'number', 'Failure viewing one stock (likes is not a number)');
      assert.equal(json.stockData.likes, 0, 'Failure viewing one stock (wrong likes number)');
    });
  });

  //use async function
  test('Viewing one stock and liking it', async () => {
    const response = await fetch(apiUrl + '?stock=TSLA&like=true');
    const json = await response.json();
    console.log(json.stockData);
    assert.equal(json.stockData.stock, 'TSLA', 'Failure viewing one stock and liking it (wrong stock symbol)');
    assert.exists(json.stockData.price, 'Failure viewing one stock and liking it (missing price)');
    assert.typeOf(json.stockData.price, 'number', 'Failure viewing one stock and liking it (price is not a number)');
    assert.exists(json.stockData.likes, 'Failure viewing one stock and liking it (missing likes)');
    assert.typeOf(json.stockData.likes, 'number', 'Failure viewing one stock and liking it (likes is not a number)');
    assert.equal(json.stockData.likes, 1, 'Failure viewing one stock and liking it (wrong likes number)');
  });

  test('Viewing the same stock and liking it again', async () => { 
    let response = await fetch(apiUrl + '?stock=AMZN&like=true');
    let json = await response.json();
    //liking again the same stock
    response = await fetch(apiUrl + '?stock=AMZN&like=true');
    json = await response.json();
    assert.equal(json.stockData.stock, 'AMZN', 'Failure viewing the same stock and liking it again (wrong stock symbol)');
    assert.exists(json.stockData.price, 'Failure viewing the same stock and liking it again (missing price)');
    assert.typeOf(json.stockData.price, 'number', 'Failure viewing the same stock and liking it again (price is not a number)');
    assert.exists(json.stockData.likes, 'Failure viewing the same stock and liking it again (missing likes)');
    assert.typeOf(json.stockData.likes, 'number', 'Failure viewing the same stock and liking it again (likes is not a number)');
    assert.equal(json.stockData.likes, 1, 'Failure viewing the same stock and liking it again (wrong likes number)');
  });

  test('Viewing two stocks', async () => {
    const response = await fetch(apiUrl + '?stock=NFLX&stock=META');
    const json = await response.json();
    console.log('json:', json);
    assert.typeOf(json.stockData, 'array', 'Failure viewing two stocks (stockData is not an array)');
    assert.lengthOf(json.stockData, 2, 'Failure viewing two stocks (length of stockData is not 2)');

    assert.equal(json.stockData[0].stock, 'NFLX', 'Failure viewing two stocks (first stock: wrong stock symbol)');
    assert.exists(json.stockData[0].price, 'Failure viewing two stocks (first stock: missing price)');
    assert.typeOf(json.stockData[0].price, 'number', 'Failure viewing two stocks (first stock: price is not a number)');
    assert.exists(json.stockData[0].rel_likes, 'Failure viewing two stocks (first stock: missing rel_likes)');
    assert.typeOf(json.stockData[0].rel_likes, 'number', 'Failure viewing two stocks (first stock: rel_likes is not a number)');
    assert.equal(json.stockData[0].rel_likes, 0, 'Failure viewing two stocks (first stock: wrong rel_likes number)');

    assert.equal(json.stockData[1].stock, 'META', 'Failure viewing two stocks (second stock: wrong stock symbol)');
    assert.exists(json.stockData[1].price, 'Failure viewing two stocks (second stock: missing price)');
    assert.typeOf(json.stockData[1].price, 'number', 'Failure viewing two stocks (second stock: price is not a number)');
    assert.exists(json.stockData[1].rel_likes, 'Failure viewing two stocks (second stock: missing rel_likes)');
    assert.typeOf(json.stockData[1].rel_likes, 'number', 'Failure viewing two stocks (second stock: rel_likes is not a number)');
    assert.equal(json.stockData[1].rel_likes, 0, 'Failure viewing two stocks (second stock: wrong rel_likes number)');
  });

  test('Viewing two stocks and liking them', async () => {
    const response = await fetch(apiUrl + '?stock=ORCL&stock=IBM&like=true');
    const json = await response.json();
    console.log('json:', json);
    assert.typeOf(json.stockData, 'array', 'Failure viewing two stocks and liking them (stockData is not an array)');
    assert.lengthOf(json.stockData, 2, 'Failure viewing two stocks and liking them (length of stockData is not 2)');

    assert.equal(json.stockData[0].stock, 'ORCL', 'Failure viewing two stocks and liking them (first stock: wrong stock symbol)');
    assert.exists(json.stockData[0].price, 'Failure viewing two stocks and liking them (first stock: missing price)');
    assert.typeOf(json.stockData[0].price, 'number', 'Failure viewing two stocks and liking them (first stock: price is not a number)');
    assert.exists(json.stockData[0].rel_likes, 'Failure viewing two stocks and liking them (first stock: missing rel_likes)');
    assert.typeOf(json.stockData[0].rel_likes, 'number', 'Failure viewing two stocks and liking them(first stock: rel_likes is not a number)');
    assert.equal(json.stockData[0].rel_likes, 0, 'Failure viewing two stocks and liking them (first stock: wrong rel_likes number)');

    assert.equal(json.stockData[1].stock, 'IBM', 'Failure viewing two stocks and liking them (second stock: wrong stock symbol)');
    assert.exists(json.stockData[1].price, 'Failure viewing two stocks and liking them (second stock: missing price)');
    assert.typeOf(json.stockData[1].price, 'number', 'Failure viewing two stocks and liking them (second stock: price is not a number)');
    assert.exists(json.stockData[1].rel_likes, 'Failure viewing two stocks and liking them (second stock: missing rel_likes)');
    assert.typeOf(json.stockData[1].rel_likes, 'number', 'Failure viewing two stocks and liking them (second stock: rel_likes is not a number)');
    assert.equal(json.stockData[1].rel_likes, 0, 'Failure viewing two stocks (second stock: wrong rel_likes number)');
  });

});
