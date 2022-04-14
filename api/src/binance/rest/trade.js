const {publicRequest, signedRequest} = require('./rest')


/**
 * Test new order creation and signature/recvWindow long. Creates and validates a new order but does not send it into the matching engine.
 * Weight: 1
 * @returns 
 */
function orderTest() {
    return signedRequest({
        method: 'post',
        path: '/api/v3/order/test',
        params: {
            symbol: 'BTCUSDT',
            side: 'BUY',
            type: 'MARKET',
            quantity: 1
        }        
    })
}


/**
 * Send in a new order.
 * Weight(UID): 1
 * Weight(IP): 1
 * 
 * @param symbol btcusdt
 * @param side BUY|SELL
 * @param type LIMIT|MARKET|STOP_LOSS|STOP_LOSS_LIMIT|TAKE_PROFIT|TAKE_PROFIT_LIMIT|LIMIT_MAKER
 * @param timeInForce
 * @param quantity
 * @param quoteOrderQty
 * @param price
 * @param newClientOrderId
 * @param stopPrice
 * @param icebergQty
 * @param newOrderRespType
 * 
 * @returns 
 */
function orderCreate({symbol, side, type, quantity, price}) {
    return signedRequest({
        method: 'post',
        path: '/api/v3/order',
        params: {
            symbol,
            side,
            type,
            quantity,
            price
        }        
    })
}


/**
 * Cancel an active order.
 * Weight(IP): 1
 * 
 * @param symbol btcusdt
 * @param orderId
 * @param origClientOrderId
 * @param newClientOrderId
 * 
 * @returns 
 */
function orderCancel({symbol, orderId}) {
    return signedRequest({
        method: 'delete',
        path: '/api/v3/order',
        params: {
            symbol,
            orderId
        }        
    })
}


/**
 * Cancels all active orders on a symbol. 
 * This includes OCO orders.
 * 
 * @param symbol
 * 
 * @returns 
 */
function orderCancelAll({symbol}) {
    return signedRequest({
        method: 'delete',
        path: '/api/v3/openOrders',
        params: {
            symbol
        }        
    })
}


/**
 * Check an order's status. 
 * Weight(IP): 2
 * 
 * @param symbol
 * @param orderId
 * @param origClientOrderId
 * 
 * @returns 
 */
 function orderGet({symbol, orderId}) {
    return signedRequest({
        method: 'get',
        path: '/api/v3/order',
        params: {
            symbol,
            orderId
        }        
    })
}


/**
 * Get all open orders on a symbol. Careful when accessing this with no symbol. 
 * Weight(IP): 
 * 3 for a single symbol; 
 * 40 when the symbol parameter is omitted;
 * 
 * @param symbol
 * 
 * @returns 
 */
 function orderGetAll({symbol}) {
    return signedRequest({
        method: 'get',
        path: '/api/v3/openOrders',
        params: {
            symbol,
            orderId
        }        
    })
}


/**
 * Get all account orders; active, canceled, or filled.
 * Weight(IP): 10 with symbol
 * 
 * @param symbol
 * @param orderId
 * @param startTime
 * @param endTime
 * @param limit 500-1000
 * 
 * @returns 
 */
 function ordersAll({symbol,orderId,startTime,endTime,limit}) {
    return signedRequest({
        method: 'get',
        path: '/api/v3/allOrders',
        params: {
            symbol,
            orderId,
            startTime,
            endTime,
            limit
        }        
    })
}


/**
 * Displays the user's current order count usage for all intervals.
 * 
 * @returns 
 */
 function orderCountUsage() {
    return signedRequest({
        method: 'get',
        path: '/api/v3/rateLimit/order'
    })
}


module.exports = {
    orderTest,
    orderCreate,
    orderCancel,
    orderCancelAll,
    orderGet,
    orderGetAll,
    ordersAll,
    orderCountUsage
}