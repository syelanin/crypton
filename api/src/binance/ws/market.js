const client = require('./websocket')


/**
 * The Trade Streams push raw trade information; 
 * each trade has a unique buyer and seller.
 * 
 * Stream Name: <symbol>@trade
 * Update Speed: Real-time
 * 
 * @param symbol
 * 
 * @returns 
 */
function trade({symbol, cb, env}) {
    const s = symbol.toLowerCase()
    const path = `/ws/${s}@trade`

    return client.subscribe({path, cb, env})
}


/**
 * The Kline/Candlestick Stream push updates to the 
 * current klines/candlestick every second.
 * 
 * @param symbol 
 * @param interval 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
 * 
 * @returns 
 */
function kline({symbol, interval, cb, env}) {
    const s = symbol.toLowerCase()
    const path = `/ws/${s}@kline_${interval}`

    return client.subscribe({path, cb, env})
}


/**
 * 24hr rolling window ticker statistics for a single symbol. 
 * These are NOT the statistics of the UTC day, 
 * but a 24hr rolling window for the previous 24hrs.
 * 
 * @param symbol
 * 
 * @returns 
 */
function ticker({symbol, cb, env}) {
    const s = symbol.toLowerCase()
    const path = `/ws/${s}@ticker`

    return client.subscribe({path, cb, env})
}


/**
 * 24hr rolling window ticker statistics for all symbols 
 * that changed in an array. 
 * These are NOT the statistics of the UTC day, 
 * but a 24hr rolling window for the previous 24hrs. 
 * Note that only tickers that have changed will be present in the array.
 * @returns 
 */
function tickerAll({cb, env}) {
    const path = `/ws/!ticker@arr`

    return client.subscribe({path, cb, env})
}


/**
 * Pushes any update to the best bid or ask's price or quantity 
 * in real-time for a specified symbol.
 * 
 * @param symbol
 * 
 * @returns 
 */
function bookTicker({symbol, cb, env}) {
    const s = symbol.toLowerCase()
    const path = `/ws/${s}@bookTicker`

    return client.subscribe({path, cb, env})
}


/**
 * Pushes any update to the best bid or ask's price or quantity 
 * in real-time for all symbols.
 * 
 * @returns 
 */
function bookTickerAll({cb, env}) {
    const path = `/ws/!bookTicker`

    return client.subscribe({path, cb, env})
}


/**
 * Top bids and asks
 * 
 * @param symbol
 * @param level 5|10|20
 * @returns 
 */
function partialBookDepth({symbol, level, cb, env}) {
    const s = symbol.toLowerCase()
    const path = `/ws/${s}@depth${level}`

    return client.subscribe({path, cb, env})
}


/**
 * Order book price and quantity depth updates used to 
 * locally manage an order book.
 * 
 * @param symbol
 * @returns 
 */
function diffBookDepth({symbol, cb, env}) {
    const s = symbol.toLowerCase()
    const path = `/ws/${s}@depth`

    return client.subscribe({path, cb, env})
}


/*

How to manage a local order book correctly

1. Open a stream to 
wss://stream.binance.com:9443/ws/bnbbtc@depth

2. Buffer the events you receive from the stream

3. Get a depth snapshot from 
https://api.binance.com/api/v3/depth?symbol=BNBBTC&limit=1000

4. Drop any event where u is <= lastUpdateId in the snapshot

5. The first processed event should have 
U <= lastUpdateId+1 AND u >= lastUpdateId+1

6. While listening to the stream, each new event's U 
should be equal to the previous event's u+1

7. The data in each event is the absolute quantity for a price level

8. If the quantity is 0, remove the price level

9. Receiving an event that removes a price level that is not in your 
local order book can happen and is normal

Note: Due to depth snapshots having a limit on the number of price levels, 
a price level outside of the initial snapshot that doesn't have a quantity 
change won't have an update in the Diff. Depth Stream. Consequently, 
those price levels will not be visible in the local order book even when 
applying all updates from the Diff. Depth Stream correctly and cause the 
local order book to have some slight differences with the real order book. 
However, for most use cases the depth limit of 5000 is enough to understand 
the market and trade effectively.

*/

module.exports = {
    trade,
    kline,    
    ticker,
    tickerAll,
    bookTicker,
    bookTickerAll,
    partialBookDepth,
    diffBookDepth
}