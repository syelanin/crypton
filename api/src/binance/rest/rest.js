const crypto = require('crypto')
const axios = require('axios')
const config = require('config')


function buildQuery(params) {
    if (!params) return ''

    return Object.entries(params)
        .filter(([key, value]) => value)
        .map(([key, value]) => {
            const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value
            return `${key}=${encodeURIComponent(valueString)}`
        })
        .join('&')
}


async function publicRequest({method, path, params = {}, env = 'test'}) {
    const baseURL = config.get(`${env}.api.base`)
    const key = config.get(`${env}.auth.key`)
    const query = buildQuery(params)

    const req = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': key
        }
    })

    try {
        console.log('query:', query)
        const res = await req.request({
            method,
            url: query ? `${path}?${query}` : path
        })

        return res.data
    }
    catch (err) {
        console.log(`publicRequest: ${method} ${path} error:`, err.message)
        console.log('error response:', err.response.data)
    }
}


async function signedRequest({method, path, params = {}, env = 'test'}) {
    const baseURL = config.get(`${env}.api.base`)
    const key = config.get(`${env}.auth.key`)
    const secret = config.get(`${env}.auth.secret`)
    const timestamp = Date.now()
    const query = buildQuery({...params, timestamp})
    const signature = crypto
        .createHmac('sha256', secret)
        .update(query)
        .digest('hex')

    const req = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': key
        }
    })

    try {
        const res = await req.request({
            method,
            url: `${path}?${query}&signature=${signature}`
        })

        return res.data
    }
    catch (err) {
        console.log(`signedRequest: ${method} ${path} error:`, err.message)
        console.log('error response:', err.response.data)
    }
}


module.exports = {
    publicRequest,
    signedRequest
}