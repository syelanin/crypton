const market = require('./rest/market')
const user = require('./rest/user')

async function balances() {
    const account = await user.accountInfo();
    console.log('account:', account.balances);
}

async function klines() {
    const symbol = 'BTCUSDT'
    const interval = '1m'
    const res = await market.klines({
        symbol,
        interval,
        limit: 1000
    })

    console.log(`test: klines: ${symbol} ${interval}:`, res.length)
}

async function main() {
    await klines()
}

main()
.catch(console.dir)
