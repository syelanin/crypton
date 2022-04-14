const {connect, JSONCodec} = require('nats')

const {formatInTimeZone} = require('date-fns-tz')
const fromUnixTime = require('date-fns/fromUnixTime')
const market = require('./ws/market')

const jc = JSONCodec()

const channels = {};
let client;


function makeSubject({
        type='',
        symbol='',
        timeframe=''
    }) {

    const id = [type,symbol,timeframe]
        .filter(e => e)
        .join('-');

    return `data.${id}`;
}


function klineSub({subject, symbol, timeframe}) {

    const subscription = market.kline({
        symbol,
        interval: timeframe,
        cb: {
            onmessage: (m) => {
                const tick = {
                    type: m.e,
                    time: formatInTimeZone(fromUnixTime(m.E/1000), 'Europe/Kiev', 'yyyy-MM-dd HH:mm:ss zzz'),
                    symbol: m.s,
                    interval: m.k.i,
                    timeframe: {
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
                
                const data = jc.encode(tick)

                client.publish(subject, data)

            }
        }
    })

    channels[subject] = subscription;    

}


function channelSubscribe({type, symbol, timeframe}) {

    const subject = makeSubject({type, symbol, timeframe});

    console.log(`channelSubscribe: subject:`, subject);

    if (type === 'kline') {
        klineSub({subject, symbol, timeframe});
    }

    // console.log(`channelSubscribe: channels:`, channels, "\n");

}


function channelUnsubscribe({type, symbol, timeframe}) {

    const subject = makeSubject({type, symbol, timeframe});

    console.log(`channelUnsubscribe: subject:`, subject);

    const subscription = channels[subject];

    if (!subscription) return;

    subscription.close();

    channels[subject] = undefined;
    delete channels[subject];

    // console.log(`channelUnsubscribe: channels:`, channels, "\n");

}


async function main() {

    client = await connect({servers: 'localhost:4222'});


    client.subscribe('control.subscribe', {
        callback: (err, msg) => {

            if (err) {
                console.log('control.subscribe:', err.message)
                return
            }

            try {
                const req = jc.decode(msg.data)

                channelSubscribe(req)
                
                msg.respond(jc.encode({
                    success: true
                }))
            }
            catch (e) {
                msg.respond(jc.encode({
                    error: e.message
                }))
            }
        }
    })


    client.subscribe('control.unsubscribe', {
        callback: (err, msg) => {
            
            if (err) {
                console.log('control.unsubscribe:', err.message)
                return
            }

            try {
                const req = jc.decode(msg.data)

                channelUnsubscribe(req)
                
                msg.respond(jc.encode({
                    success: true
                }))
            }
            catch (e) {
                msg.respond(jc.encode({
                    error: e.message
                }))
            }
            
        }
    })
    
}


main()