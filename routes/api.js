'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  likes: Array
});

const Stock = mongoose.model('Stock', stockSchema);

const getLikes = async (symbol, like, ip) => {
  //look in DB for a stock with the given symbol
  try {
    let stock = await Stock.findOne({ symbol: symbol });
    //if a stock with the given symbol is not found, create one
    if (!stock) {
      let stock = await Stock.create({ symbol: symbol, likes: like === 'true' ? [await bcrypt.hash(ip, 1)] : [] });
      return stock.likes.length;
    } else {
      //if the current client IP is not already included in likes and the stock is liked, add it
      if (!stock.likes.some(async hash => await bcrypt.compare(ip, hash)) && like === 'true') {
        stock.likes.push(await bcrypt.hash(ip, 1));
        await stock.save();
      }
      return stock.likes.length;
    }
  }
  catch (err) {
    console.error('Error in getLikes() function:', err);
  }
};

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      console.log('stock:', req.query.stock, 'like:', req.query.like, 'isArray:', Array.isArray(req.query.stock), 'IP:', ip);
      if (!Array.isArray(req.query.stock)) {
        Promise.all([fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock}/quote`),
          getLikes(req.query.stock, req.query.like, ip)])
          .then(promiseResults => Promise.all([promiseResults[0].json(), promiseResults[1]]))
          .then(promiseResults => {
            res.json({stockData: 
              {stock: 
                promiseResults[0].symbol, 
                price: promiseResults[0].latestPrice, 
                likes: promiseResults[1]
              }
            });
          });
        
      } else {
        Promise.all([fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[0]}/quote`), 
          fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${req.query.stock[1]}/quote`),
          getLikes(req.query.stock[0], req.query.like, ip),
          getLikes(req.query.stock[1], req.query.like, ip)])
          .then(promiseResults => Promise.all([promiseResults[0].json(), promiseResults[1].json(), promiseResults[2], promiseResults[3]]))
          .then(promiseResults => {
            res.json({stockData: [
              {stock: 
                promiseResults[0].symbol, 
                price: promiseResults[0].latestPrice, 
                rel_likes: promiseResults[2] - promiseResults[3]}, 
              {stock: 
                promiseResults[1].symbol, 
                price: promiseResults[1].latestPrice, 
                rel_likes: promiseResults[3] - promiseResults[2]}
              ]});
          });
      }
    });
};
