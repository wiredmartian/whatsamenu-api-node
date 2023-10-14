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

##### .env
``` .env
API_KEY=WM.shdhd
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
