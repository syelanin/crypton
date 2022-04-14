const {Spot} = require('@binance/connector')

const config = require('config')

const key = config.get('testnet.auth.key')
const secret = config.get('auth.auth.secret')

const spot = new Spot(key, secret, {baseURL: 'https://testnet.binance.vision'})


async function main() {
    const account = await spot.account()

    console.log(account)
}

main()
.catch(console.dir)