import React from "react";
import {useSelector, useDispatch} from 'react-redux';
import {
    selectConnected,
    selectChannel,
    apiChannelSubscribe,
    apiChannelUnsubscribe
} from '../../features/nats/natsSlice';

import styles from './Chart.module.css';


export function Chart() {
    
    const [subject, setSubject] = React.useState({
        type: null,
        symbol: null,
        timeframe: null
    });

    const dispatch = useDispatch();

    const connected = useSelector(selectConnected);
    const subscription = useSelector(selectChannel(subject));

    const subj = () => {
        const t = subject.type || ''
        const s = subject.symbol || ''
        const tf = subject.timeframe || ''
        return `${t} ${s} ${tf}`
    }

    const view = () => {
        if (!subscription) return {}
        if (!subscription.message || !subscription.message.type) return {}
        
        const msg = subscription.message
        
        return {
            time: msg.time,
            symbol: msg.symbol,
            interval: msg.interval,
            from: msg.timeframe.begin,
            to: msg.timeframe.end,
            open: msg.price.open,
            high: msg.price.high,
            low: msg.price.low,
            close: msg.price.close
        }
    }

    const v = view()


    const sub1 = () => {
        if (connected) {
            dispatch(apiChannelUnsubscribe(subject));

            const subj = {
                type: 'kline',
                symbol: 'btcusdt',
                timeframe: '1m'
            }

            dispatch(apiChannelSubscribe(subj));
            setSubject(subj);
        }
    }

    const sub2 = () => {
        if (connected) {
            dispatch(apiChannelUnsubscribe(subject));

            const subj = {
                type: 'kline',
                symbol: 'ethusdt',
                timeframe: '1h'
            }

            dispatch(apiChannelSubscribe(subj));
            setSubject(subj);

        }
    }

    const canvasRef = React.createRef();
    const canvasWidth = 500;
    const canvasHeight = 500;

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')

        const bar = new Path2D()
        bar.rect(0,0,100,100)
        ctx.fillStyle = 'rgba(0,200,0,1)'
        ctx.fill(bar)
    }, [canvasRef])

    const [offset, setOffset] = React.useState({x: 0, y: 0})
    const [drag, setDrag] = React.useState(false)

    const mousemove = (e) => {
        setOffset({
            x: e.clientX,
            y: e.clientY
        })
    }

    const mousedown = (e) => {
        setDrag(true)
    }

    const mouseup = (e) => {
        setDrag(false)
    }
    

    return (
        <div className={styles.chart}>
            <div>
                <div>connected: {connected ? 'true' : 'false'}</div>
                <div>Subject: {subj()}</div>
                
                <button onClick={() => sub1()}>btcusdt</button>
                <button onClick={() => sub2()}>ethusdt</button>
            </div>
            <div>Messages:</div>

            <div className={styles.messages}>
                    
                    <div className={styles.message}>
                        <div className={styles.text}>
                            <div>
                                <div>time: {v.time}</div>
                                <div>symbol: {v.symbol}</div>
                                <div>interval: {v.interval}</div>
                                <div>from: {v.from}</div>
                                <div>to: {v.to}</div>
                                <div>
                                    <div>open: {v.open}</div>
                                    <div>high: {v.high}</div>
                                    <div>low: {v.low}</div>
                                    <div>close: {v.close}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                
            </div>

            <div>
                <div>offset: {offset.x} {offset.y}</div>
                <div>drag: {drag ? 'true' : 'false'}</div>
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseMove={mousemove}
                    onMouseDown={mousedown}
                    onMouseUp={mouseup}
                >
                </canvas>
            </div>
            
        </div>
    );
}