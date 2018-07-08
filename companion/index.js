import * as messaging from 'messaging';
import { settingsStorage } from 'settings';

import { CryptoAPI } from './api';
import { SYMBOLS, SELECTED_SYMBOL} from '../common/globals';

settingsStorage.onchange = function(evt) {
  sendPricingData();
}

messaging.peerSocket.onmessage = function() {
  sendPricingData();
}

function sendPricingData() {
  let symbolSetting = settingsStorage.getItem(SELECTED_SYMBOL);
  if (symbolSetting) {
    try {
      symbolSetting = JSON.parse(symbolSetting);
    }
    catch (e) {
      console.log("error parsing setting value: " + e);
    }
  }
  
  let symbol;
  if (symbolSetting) {
    symbol = SYMBOLS[symbolSetting['selected'][0]];
  } else {
    symbol = SYMBOLS[0];
  }
  
  console.log(symbol);
  
  const cryptoApi = new CryptoAPI();
  
  // tessting
  // cryptoApi.OHLCV(symbol, MINUTE, 60, 1).then(function(data) {
  //   const prices = data.
  // })
  
  cryptoApi.minutePrices(symbol).then(function(minutePrices) {
    cryptoApi.hourHL(symbol).then(function(hourHL) {
      const data = {
        hour: {
          high: hourHL.high,
          low: hourHL.low
        },
          minute: minutePrices
        }

        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send(data);
        }
    });
  })
  .catch(function (err) {
    console.log('Error: ' + err);
  });
}