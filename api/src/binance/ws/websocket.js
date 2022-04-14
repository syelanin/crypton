const WebsocketClient = require('ws')
const config = require('config')


function subscribe({path, cb: {onopen=null, onclose=null, onmessage=null, onerror=null}={}, env='test'}) {
    const baseURL = config.get(`${env}.ws.base`)
    const url = `${baseURL}${path}`

    const client = new WebsocketClient(url)

    client.on('open', () => {
        return onopen ? onopen() : console.log(`# ws.opened:`, url)
    })

    client.on('close', (code, reason) => {
        const r = reason.toString()
        return onclose ? onclose(code, r) : console.log('# ws.closed:', code, r)
    })

    client.on('message', (message) => {
        const msg = JSON.parse(message.toString())
        return onmessage ? onmessage(msg) : console.log('# ws.message:', msg)
    })

    client.on('error', (error) => {
        return onerror ? onerror(error) : console.log('# ws.error:', error)
    })

    client.on('ping', (data) => {
        console.log('# ws.ping:', data.toString())
        client.pong()
    })

    client.on('pong', (data) => {
        console.log('# ws.pong:', data.toString())
    })    

    return client
}


module.exports = {
    subscribe
}