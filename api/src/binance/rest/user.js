const {publicRequest, signedRequest} = require('./rest')


/**
 * Get current account information.
 * Weight(IP): 10
 * 
 * @returns 
 */
 function accountInfo() {
    return signedRequest({
        method: 'get',
        path: '/api/v3/account'        
    })
}


/**
 * Get trades for a specific account and symbol.
 * Weight(IP): 10
 * 
 * @param symbol
 * @param orderId
 * @param startTime
 * @param endTime
 * @param fromId
 * 
 * @returns 
 */
 function myTrades({symbol, orderId, startTime, endTime, fromId}) {
    return signedRequest({
        method: 'get',
        path: '/api/v3/myTrades',
        params: {
            symbol,
            orderId,
            startTime,
            endTime,
            fromId
        }
    })
}


module.exports = {
    accountInfo,
    myTrades
}