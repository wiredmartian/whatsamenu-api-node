# whatsamenu-api-node
A Node client for WhatsAMenu API (https://github.com/wiredmartian/whatsamenu-api-documentation)


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

#### Using bootstrapped API
A bootstrapped Whatsamenu API will return a singleton which can be used call other object functions

``` js
import { DefaultMenuHttpClient, MenuAPI } from "@wiredmartians/whatsamenu-node"

// setup an axios client
const apiKey = process.env.API_KEY
const baseURL = process.env.BASE_URL ?? "https://whatsamenu.core.wiredmartians.com/v1"
const client = DefaultMenuHttpClient.create({
    baseURL,
    headers: {
        "X-API-Key": apiKey
    }
})

// bootstrap menuApi
const { menuApi } = new MenuAPI(client)

// make requests
menuApi.restaurant
    .getRestaurants()
    .then((res) => console.log(res))
    .catch((err) => console.error(err))

```