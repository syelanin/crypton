const {publicRequest, signedRequest} = require('./rest')


/**
 * Test connectivity to the Rest API.
 * Weight(IP): 1
 * 
 * @returns 
 */
function ping() {
    return publicRequest({
        method: 'get',
        path: '/api/v3/ping'
    })
}


/**
 * Test connectivity to the Rest API and get the current server time.
 * Weight(IP): 1
 * 
 * @returns 
 */
function time() {
    return publicRequest({
        method: 'get',
        path: '/api/v3/time'
    })
}


/**
 * Current exchange trading rules and symbol information
 * Weight(IP): 10
 * 
 * @returns 
 */
function exchangeInfo() {
    return publicRequest({
        method: 'get',
        path: '/api/v3/exchangeInfo'
    })
}


/**
 * Order Book
 * Weight(IP):
 * 1-100 	1
 * 101-500 	5
 * 501-1000 	10
 * 1001-5000 	50
 * 
 * @param symbol btcusdt
 * @param limit 100-5000
 * 
 * @returns 
 */
function orderBook({symbol, limit}) {
    return publicRequest({
        method: 'get',
        path: '/api/v3/depth',
        params: {
            symbol,
            limit
        }        
    })
}


/**
 * Get recent trades.
 * Weight(IP): 1
 * 
 * @param symbol btcusdt
 * @param limit 500-5000
 * 
 * @returns 
 */
function recentTrades({symbol, limit}) {
    return publicRequest({
        method: 'get',
        path: '/api/v3/trades',
        params: {
            symbol,
            limit
        }        
    })
}


/**
 * Get older market trades.
 * Weight(IP): 5
 * 
 * @param symbol btcusdt
 * @param limit 500-5000
 * @param fromId
 * 
 * @returns 
 */
 function historicalTrades({symbol, limit, fromId}) {
    return publicRequest({
        method: 'get',
        path: '/api/v3/historicalTrades',
        params: {
            symbol,
            limit,
            fromId
        }        
    })
}


/**
 * Kline/candlestick bars for a symbol.
 * Klines are uniquely identified by their open time.
 * Weight(IP): 1
 * 
 * @param symbol btcusdt
 * @param interval 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
 * @param startTime
 * @param endTime
 * @param limit 500-1000
 * 
 * @returns 
 */
 function klines({symbol, interval, startTime, endTime, limit}) {
    return publicRequest({
        method: 'get',
        path: '/api/v3/klines',
        params: {
            symbol,
            interval,
            startTime,
            endTime,
            limit
        }        
    })
}


module.exports = {
    ping,
    time,
    exchangeInfo,
    orderBook,
    recentTrades,
    historicalTrades,
    klines
}