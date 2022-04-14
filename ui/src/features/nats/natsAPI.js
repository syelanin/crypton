import {connect, StringCodec, JSONCodec} from 'nats.ws';

let client = null;
let subscriptions = {};
let channels = {};


export function makeSubject({
        type='',
        symbol='',
        timeframe=''
    }) {
    
    const id = [type,symbol,timeframe]
        .filter(e => e)
        .join('-');

    return `data.${id}`;
}


export async function clientConnect() {

    if (client) return;

    const servers = [
        "ws://localhost:9222",
        // "wss://localhost:9222"
    ];

    try {
        client = await connect({servers});
        return client;
    }
    catch (error) {
        client = null;
        throw error;
    }

}


export async function clientClose() {

    if (!client) return;

    try {
        await client.close();
    }
    catch (error) {
        throw error;
    }
    finally {
        client = null;
        subscriptions = {};
    }

}


export function subjectSubscribe({subject, cb}) {

    if (!client) return;
    if (!subject || typeof subject !== 'string') return;
    if (subscriptions[subject]) return;

    try {
        const sc = StringCodec();

        const subscription = client.subscribe(subject, {
            callback: (err, msg) => {
                const message = JSON.parse(sc.decode(msg.data));
                return cb(err, message);
            }
        });

        subscriptions[subject] = subscription;
    }
    catch (error) {
        throw error;
    }

}


export function subjectUnsubscribe({subject}) {

    if (!client) return;
    if (!subject || typeof subject !== 'string') return;
    if (!subscriptions[subject]) return;

    try {
        const subscription = subscriptions[subject];
        
        if (subscription) {
            subscription.unsubscribe();
        }
    }
    catch (error) {
        throw error;
    }
    finally {
        subscriptions[subject] = undefined;
        // delete subscriptions[subject];
    }

}


export async function channelSubscribe({
        type,
        symbol,
        timeframe,
        cb: {onstatus, onmessage}
    }) {

    if (!client) return;
    
    const subject = makeSubject({type, symbol, timeframe});

    if (!channels[subject]) {
        channels[subject] = {};
    }
    

    try {
        const jc = JSONCodec();

        const reqInfo = jc.encode({type, symbol, timeframe});

        const res = await client.request('control.subscribe', reqInfo);

        const resInfo = jc.decode(res.data);

        onstatus(resInfo);
        // console.log(`api: channelSubscribe: res:`, resInfo)

        if (resInfo.success) {

            const subscription = client.subscribe(subject, {
                callback: (err, msg) => {
                    const message = jc.decode(msg.data);
                    return onmessage(err, message);
                }
            });
    
            channels[subject] = subscription;
            // console.log(`api: channelSubscribe: channels:`, channels)

        }
        else {
            throw new Error(`Channel status error: ${resInfo.error}`);
        }
        
    }
    catch (error) {
        throw error;
    }

}


export async function channelUnsubscribe({
        type,
        symbol,
        timeframe,
        cb: {onstatus}
    }) {

    if (!client) return;

    const subject = makeSubject({type, symbol, timeframe});

    if (!channels[subject]) return;


    try {
        const jc = JSONCodec();

        const reqInfo = jc.encode({type, symbol, timeframe});

        const res = await client.request('control.unsubscribe', reqInfo);

        const resInfo = jc.decode(res.data);

        onstatus(resInfo);
        // console.log(`api: channelUnsubscribe: res:`, resInfo)

        if (resInfo.success) {
        
            if (channels[subject]) {
                // console.log(`api: channelUnsubscribe: channel:`, subject, channels[subject])
                channels[subject].unsubscribe();
            }

        }
        else {
            throw new Error(`Channel status error: ${resInfo.error}`);
        }
        
    }
    catch (error) {
        throw error;
    }
    finally {
        channels[subject] = undefined;
        delete channels[subject];
        // console.log(`api: channelUnsubscribe: channels:`, channels)
    }

}