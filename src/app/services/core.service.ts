import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class CoreService {
  getDiff(item: any) {
    let decimals = item.symbol.indexOf("USDT") > 0 ? 7 : 8;
    let result = +item.close - +item.open;

    let final = result.toFixed(decimals);
    if(+item.close > +item.open) {
      final = `+${final}`;
    }
    return final;
  }

  getUrl(item: any): string {
    if(item.exchange === "BINANCE") {
      let symbol = item.symbol;
      if(symbol.endsWith("BTC")) {
        symbol = symbol.replace("BTC", "_BTC");        
      } else {
        symbol = symbol.replace("USDT", "_USDT");
      }
      return `https://www.binance.com/en/trade/pro/${symbol}`;
    }
  }
}