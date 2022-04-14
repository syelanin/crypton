const {publicRequest, signedRequest} = require('./rest')


/**
 * Fetch system status.
 * Weight(IP): 1
 * 
 * @returns 
 */
function systemStatus() {
    return signedRequest({
        env: 'prod',
        method: 'get',
        path: '/sapi/v1/system/status'
    })
}


/**
 * Get information of coins (available for deposit and withdraw) for user.
 * Weight(IP): 10
 * @returns 
 */
function allCoins() {
    return signedRequest({
        env: 'prod',
        method: 'get',
        path: '/sapi/v1/capital/config/getall'
    })
}


/**
 * Fetch account status detail.
 * Weight(IP): 1
 * @returns 
 */
function accountStatus() {
    return signedRequest({
        env: 'prod',
        method: 'get',
        path: '/sapi/v1/account/status'
    })
}


/**
 * Fetch account api trading status detail.
 * Weight(IP): 1
 * @returns 
 */
function apiTradingStatus() {
    return signedRequest({
        env: 'prod',
        method: 'get',
        path: '/sapi/v1/account/apiTradingStatus'
    })
}


module.exports = {
    systemStatus,
    allCoins,
    accountStatus,
    apiTradingStatus
}