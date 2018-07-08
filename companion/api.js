export function CryptoAPI() {};

CryptoAPI.prototype.minutePrices = function(symbol) {
  
  return new Promise(function(resolve, reject) {
    
    let url = 'https://min-api.cryptocompare.com/data/histominute'
    url += '?tsym=USD';
    url += '&fsym=' + symbol;
    url += '&limit=60';
    
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      const data = response.Data.map(function(d) {
        return d.open;
      });
      resolve(data);
    })
    .catch(function(err) {
      reject(err);
    });
    
  });
}

CryptoAPI.prototype.OHLCV = function(symbol, interval, limit, aggregate) {
  
  return new Promise(function(resolve, reject) {
    
    let url = 'https://min-api.cryptocompare.com/data/';
    
    switch (interval) {
      case MINUTE:
        url+='histominute';
        break;
      case HOUR:
        url+='histohour';
        break;
      case DAY:
        url+= 'histoday';
        break;
    }
    
    url += '?tsym=USD';
    url += '&fsym=' + symbol;
    url += '&limit=' + limit;
    
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      resolve(response.Data);
    })
    .catch(function(err) {
      reject(err);
    });
    
  });
}

CryptoAPI.prototype.hourHL = function(symbol) {
  return new Promise(function(resolve, reject) {
    
    let url = 'https://min-api.cryptocompare.com/data/histohour'
    url += '?fsym=' + symbol;
    url += '&tsym=USD';
    url += '&limit=1';
    
    fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      const highLows = {
        high: response.Data[0].high,
        low: response.Data[0].low
      };
      resolve(highLows);
    })
    .catch(function(err) {
      reject(err);
    });
  });
 
}
