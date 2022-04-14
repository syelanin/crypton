
# System Design


## Architecure

messaging server (nats):

ui (react-redux):

api (node):
- load data from files, database
- interface with rest api, websocket
- interface with ml service
- trading
- analytics

ml service (tensorflow):

database (mongo):

cache (redis):


## Data

sources:
- rest api (account, trade)
- websocket (market)
- file (market history data)

database:
- market history data (kline, orderbook, trades)

api:
- data from database
- data from rest apis
- data from websocket
- data from cache

cache (api or external):
- symbol data
- timeframes

ui:
- requested from api on demand
- ephemeral


## Chart

component:
  - provider (exchange)
  - currency (can be changed)
  - ticker
  - klines (timeframe can be changed)
  - orderbook

subscribe to websocket topics in exchange:
  - ticker (realtime)
  - klines (1m)
  - orderbook (realtime)


## Chart Group

component:
  - compare currencies
  - compare timeframes
  - compare currency for providers


## Dashboard

component:
  - mini ticker for all currencies
  - mini ticker for orderbooks
  - currencies performance
  - currencies correlations
  - providers correlations (arbitrage)



# UI API integration


## channels

- control channels (pub/sub subjects):
  - ticker
  - orderbook
  - orders
  - kline

- data channels (pub/sub subjects):
  - ticker
  - orderbook
  - orders
  - kline


## transactions

- request data:

  1. ui: request for data
  - control: publish request to 'req' channel
  
  2. api: reply with data
  - control: publish response to 'res' channel


- create data subscription:

  1. ui: request to subscribe
  - control: publish data with subscription details
  
  2. api: process request
  - subscribe to websocket
  - create 'data' channel
  - data: start publishing data to 'data' channel
  - control: publish 'data' channel details

  1. ui: consume subsciption
  - control: get 'data' channel details
  - data: subscribe to 'data' channel
  - control: publish status


- recover data subsciption:


- close data subscription:

  1. ui: request to unsubscribe
  - control: publish data with details

  2. api: process request
  - unsubscribe from websocket
  - control: publish ack

  3. ui: clean up
