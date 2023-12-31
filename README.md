# Whatsamenu Node
A Node.js client for [WhatsAMenu API](https://github.com/wiredmartian/whatsamenu-api-documentation)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/7238091-c337fbed-43fc-4a66-870c-3cfbdc1167e2?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D7238091-c337fbed-43fc-4a66-870c-3cfbdc1167e2%26entityType%3Dcollection%26workspaceId%3Df7aedb7c-b2ff-43da-b219-270fbd08a6e3)

### Getting Started

Make sure your node environment is setup

##### API Key

This package assumes you already have an API Key. If you don't have one, you can go to [wiredmartians.com](https://menu.wiredmartians.com/get-started) to create one or use http endpoint to create a key


#### Status
[![publish](https://github.com/wiredmartian/whatsamenu-api-node/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/wiredmartian/whatsamenu-api-node/actions/workflows/publish.yml)

### Installation

Using npm:

```
$ npm install @wiredmartians/whatsamenu-node
```

Using yarn:

```
$ yarn add @wiredmartians/whatsamenu-node
```


### Example


##### .env
``` .env
API_KEY = <your api key>
API_BASE_URL=https://whatsamenu.core.wiredmartians.com/v1
```

#### Axios Client

This lib currently uses only axios for http requests

``` js
import { DefaultMenuHttpClient } from "@wiredmartians/whatsamenu-node"

// setup an axios client
const apiKey = process.env.API_KEY
const baseURL = process.env.BASE_URL
const client = DefaultMenuHttpClient.create({
    baseURL,
    headers: {
        "X-API-Key": apiKey
    }
})
```

#### Using bootstrapped API
A bootstrapped Whatsamenu API will return a singleton which can be used call other object functions


``` js
import { MenuAPI } from "@wiredmartians/whatsamenu-node"

// bootstrap menuApi, passing the axios client
const { menuApi } = new MenuAPI(client)

// make requests
menuApi.restaurant
    .getRestaurants()
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

```

#### Using indivisual modules

``` js
import { Restaurant } from "@wiredmartians/whatsamenu-node/restaurant"

// pass the axios client
const restaurant = new Restaurant(client)

// make requests
restaurant
    .getRestaurants()
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

```

### TypeScript usage

``` ts
import { AxiosInstance } from "axios"
import { DefaultMenuHttpClient, MenuAPI } from "@wiredmartians/whatsamenu-node"
import { Restaurant, RestaurantResult } from "@wiredmartians/whatsamenu-node/restaurant"

const apiKey = process.env.API_KEY
const baseURL =  process.env.API_BASE_URL
const client: AxiosInstance = DefaultMenuHttpClient.create({
    baseURL,
    headers: {
        "X-API-Key": apiKey
    }
})

const { menuApi } = new MenuAPI(client)

const restaurant: Restaurant = menuApi.restaurant

restaurant.getRestaurants()
    .then((res: RestaurantResult[]) => console.log(res))
    .catch((err) => console.error(err))

```