# Backend

## API Routes

- [Listings]
  - [Get all listings](#get-listings)
  - [Get a specific listings by token address and token id pair](#get-listings0x_token_addresstoken_id)
  - [Get all the listings listed by a seller](#get-listings0xseller)
  - [Delete listing](#delete-listings0x_token_addresstoken_id)
  - [Add listing](#post-listings)
  - [Update listing](#put-listings0x_token_addresstoken_id)
- [Tokens]
- [Minting]

### `listings`

Routes relating to NFT listing details.

#### GET `/listings/`

**Description**
<br>
Retrieves the list of nfts sold on the marketplace.

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": [
            {
                "_id": "1",
                "token_address": "0xdeadbeef",
                "token_id": "1",
                "seller": "0xcafebabe",
                "price": "10000000000000000000",
                "listing_date": "2020-10-28T23:58:18Z",
                "modified_date": "2020-10-28T23:58:18Z",
            }
        ]
    }
</details>

---

#### GET `/listings/<0x_token_address>/<token_id>`

**Description**
<br>
Get a specific listing detail by token address - token id pair

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| token_address | String | Yes | NFT token address in Base16 format |
| token_id | String | Yes | NFT token ID |

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": {
            "_id": "1",
            "token_address": "0xdeadbeef",
            "token_id": "1",
            "seller": "0xcafebabe",
            "price": "10000000000000000000",
            "listing_date": "2020-10-28T23:58:18Z",
            "modified_date": "2020-10-28T23:58:18Z",
        }
    }
</details>

---

#### GET `/listings/<0x_seller>`

**Description**
<br>
Get all the listings details sold by a specifc seller.

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| seller | String | Yes | seller wallet address in Base16 format |

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": {
            "_id": "1",
            "token_address": "0xdeadbeef",
            "token_id": "1",
            "seller": "0xcafebabe",
            "price": "10000000000000000000",
            "listing_date": "2020-10-28T23:58:18Z",
            "modified_date": "2020-10-28T23:58:18Z",
        }
    }
</details>

---

#### DELETE `/listings/<0x_token_address>/<token_id>`

**Description**
<br>
Deletes a specific listing when sold.

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| token_address | String | Yes | NFT token address in Base16 format |
| token_id | String | Yes | NFT token ID |

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": {
            "lastErrorObject": {
                "n": 1
            },
            "value": {
                "_id": "62cd2189bda884afe6f3401b",
                "token_address": "0x123",
                "token_id": "1",
                "seller": "0xdeadbeef",
                "price": "2000000000000000000",
                "listing_date": "2022-07-12T07:23:53.880Z",
                "modified_date": "2022-07-12T07:24:32.365Z"
            },
            "ok": 1,
            "$clusterTime": {
                "clusterTime": {
                    "$timestamp": "7119384029467508748"
                },
                "signature": {
                    "hash": "Ro0Hbt2/YCHJ+05BasV1TaAR4wI=",
                    "keyId": {
                        "low": 11,
                        "high": 1643310689,
                        "unsigned": false
                    }
                }
            },
            "operationTime": {
                "$timestamp": "7119384029467508748"
            }
        }
    }
</details>

---

#### POST `/listings`

**Description**
<br>
Add a listed nft on the marketplace.

**Request Body**
```
{
    "token_address": "",
    "token_id": "",
    "seller": "",
    "price": ""
}
```

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": {
            "acknowledged": true,
            "insertedId": "62cd2189bda884afe6f3401b"
        }
    }
</details>

---

#### PUT `/listings/<0x_token_address>/<token_id>`

**Description**
<br>
Updates the price of the listed NFT.

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| token_address | String | Yes | NFT token address in Base16 format |
| token_id | String | Yes | NFT token ID |

**Request Body**
```
{
    "price": "<new_price>"
}
```

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": {
            "lastErrorObject": {
                "n": 1,
                "updatedExisting": true
            },
            "value": {
                "_id": "62cd2189bda884afe6f3401b",
                "token_address": "0x123",
                "token_id": "1",
                "seller": "0xdeadbeef",
                "price": "1000000000000000000",
                "listing_date": "2022-07-12T07:23:53.880Z",
                "modified_date": "2022-07-12T07:23:53.880Z"
            },
            "ok": 1,
            "$clusterTime": {
                "clusterTime": {
                    "$timestamp": "7119383625740582949"
                },
                "signature": {
                    "hash": "rZ0RsjpYsRFX5NwzPmL0Crsvqcs=",
                    "keyId": {
                        "low": 11,
                        "high": 1643310689,
                        "unsigned": false
                    }
                }
            },
            "operationTime": {
                "$timestamp": "7119383625740582949"
            }
        }
    }
</details>

---

### `minting`


### `tokens`


#### GET `/listings/<0x_token_address>/<token_id>`

**Description**
<br>

**Request Params**

**Request Body**
<br>
N/A

**Sample Response**
