const {formatInTimeZone} = require('date-fns-tz')
const fromUnixTime = require('date-fns/fromUnixTime')
const market = require('./ws/market')


// const client = market.ticker({symbol: 'btcusdt'})
function subTickerAll() {
    const c1 = market.tickerAll({cb: {
        onmessage: (message) => {
            
            const tick = message.map(m => ({
                type: m.e,
                time: formatInTimeZone(fromUnixTime(m.E/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                symbol: m.s,
                open: m.o,
                high: m.h,
                low: m.l,
                close: m.c,
                basevol: m.v,
                quotevol: m.q,
                trades: m.n
            })) 
            console.log('tick:', tick)
        }
    }})

    /*
    
    {
        "e": "24hrTicker",  // Event type
        "E": 123456789,     // Event time
        "s": "BNBBTC",      // Symbol
        "p": "0.0015",      // Price change
        "P": "250.00",      // Price change percent
        "w": "0.0018",      // Weighted average price
        "x": "0.0009",      // First trade(F)-1 price (first trade before the 24hr rolling window)
        "c": "0.0025",      // Last price
        "Q": "10",          // Last quantity
        "b": "0.0024",      // Best bid price
        "B": "10",          // Best bid quantity
        "a": "0.0026",      // Best ask price
        "A": "100",         // Best ask quantity
        "o": "0.0010",      // Open price
        "h": "0.0025",      // High price
        "l": "0.0010",      // Low price
        "v": "10000",       // Total traded base asset volume
        "q": "18",          // Total traded quote asset volume
        "O": 0,             // Statistics open time
        "C": 86400000,      // Statistics close time
        "F": 0,             // First trade ID
        "L": 18150,         // Last trade Id
        "n": 18151          // Total number of trades
    }
    
    */
    
    setTimeout(() => {
        c1.close()
    }, 3000)
}

function subKline() {
    let i = 0;

    console.log('kline:')

    const c1 = market.kline({
        symbol: 'BTCUSDT',
        interval: '1m',
        cb: {
            onmessage: (m) => {
                const tick = {
                    type: m.e,
                    time: formatInTimeZone(fromUnixTime(m.E/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                    symbol: m.s,
                    k: {
                        interval: m.k.i,
                        time: {
                            begin: formatInTimeZone(fromUnixTime(m.k.t/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                            end: formatInTimeZone(fromUnixTime(m.k.T/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz')
                        },                    
                        price: {
                            open: m.k.o,
                            high: m.k.h,
                            low: m.k.l,
                            close: m.k.c
                        },
                        volume: {
                            base: m.k.v,
                            quote: m.k.q
                        },
                        trades: m.k.n,
                        closed: m.k.x
                    }
                }
                i++;
                console.log(i, tick)
            }
        }
    })

    /*
    
    {
        "e": "kline",     // Event type
        "E": 123456789,   // Event time
        "s": "BNBBTC",    // Symbol
        "k": {
            "t": 123400000, // Kline start time
            "T": 123460000, // Kline close time
            "s": "BNBBTC",  // Symbol
            "i": "1m",      // Interval
            "f": 100,       // First trade ID
            "L": 200,       // Last trade ID
            "o": "0.0010",  // Open price
            "c": "0.0020",  // Close price
            "h": "0.0025",  // High price
            "l": "0.0015",  // Low price
            "v": "1000",    // Base asset volume
            "n": 100,       // Number of trades
            "x": false,     // Is this kline closed?
            "q": "1.0000",  // Quote asset volume
            "V": "500",     // Taker buy base asset volume
            "Q": "0.500",   // Taker buy quote asset volume
            "B": "123456"   // Ignore
        }
    }
    
    */
    
    setTimeout(() => {
        c1.close()
    }, 2 * 60 * 1000)
}


function subPartialBookDepth() {
    let i = 0;

    const c1 = market.partialBookDepth({
        symbol: 'BTCUSDT',
        level: 10,
        cb: {
            onmessage: (m) => {
                /*const tick = {
                    type: m.e,
                    time: formatInTimeZone(fromUnixTime(m.E/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                    symbol: m.s,
                    k: {
                        interval: m.k.i,
                        time: {
                            begin: formatInTimeZone(fromUnixTime(m.k.t/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                            end: formatInTimeZone(fromUnixTime(m.k.T/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz')
                        },                    
                        price: {
                            open: m.k.o,
                            high: m.k.h,
                            low: m.k.l,
                            close: m.k.c
                        },
                        volume: {
                            base: m.k.v,
                            quote: m.k.q
                        },
                        trades: m.k.n,
                        closed: m.k.x
                    }
                }
                i++;
                console.log(i, tick)*/
                console.log('partialBookDepth:', m)
            }
        }
    })

    /*
    
    {
        "lastUpdateId": 160,  // Last update ID
        "bids": [             // Bids to be updated
            [
            "0.0024",         // Price level to be updated
            "10"              // Quantity
            ]
        ],
        "asks": [             // Asks to be updated
            [
            "0.0026",         // Price level to be updated
            "100"             // Quantity
            ]
        ]
    }

    
    */
    
    setTimeout(() => {
        c1.close()
    }, 1 * 5 * 1000)
}


function subDiffBookDepth() {
    let i = 0;

    const c1 = market.diffBookDepth({
        symbol: 'BTCUSDT',
        cb: {
            onmessage: (m) => {
                /*const tick = {
                    type: m.e,
                    time: formatInTimeZone(fromUnixTime(m.E/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                    symbol: m.s,
                    k: {
                        interval: m.k.i,
                        time: {
                            begin: formatInTimeZone(fromUnixTime(m.k.t/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                            end: formatInTimeZone(fromUnixTime(m.k.T/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz')
                        },                    
                        price: {
                            open: m.k.o,
                            high: m.k.h,
                            low: m.k.l,
                            close: m.k.c
                        },
                        volume: {
                            base: m.k.v,
                            quote: m.k.q
                        },
                        trades: m.k.n,
                        closed: m.k.x
                    }
                }
                i++;
                console.log(i, tick)*/
                console.log('diffBookDepth:', m)
            }
        }
    })

    /*
    
    {
        "e": "depthUpdate", // Event type
        "E": 123456789,     // Event time
        "s": "BNBBTC",      // Symbol
        "U": 157,           // First update ID in event
        "u": 160,           // Final update ID in event
        "b": [              // Bids to be updated
            [
            "0.0024",       // Price level to be updated
            "10"            // Quantity
            ]
        ],
        "a": [              // Asks to be updated
            [
            "0.0026",       // Price level to be updated
            "100"           // Quantity
            ]
        ]
    }
    
    */
    
    setTimeout(() => {
        c1.close()
    }, 1 * 10 * 1000)
}



// subKline()
subPartialBookDepth()
// subDiffBookDepth()