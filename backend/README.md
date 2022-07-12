# Backend

## API Routes

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
        success: true,
        result: [
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

Get a specific listing detail by token address - token id pair

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| token_address | String | Yes | NFT token address in Base16 format |
| token_id | String | Yes | NFT token ID |

**Request Body**

N/A

**Sample Response**

```
{
    success: true,
    result: {
        "_id": "1",
        "token_address": "0xdeadbeef",
        "token_id": "1",
        "seller": "0xcafebabe",
        "price": "10000000000000000000",
        "listing_date": "2020-10-28T23:58:18Z",
        "modified_date": "2020-10-28T23:58:18Z",
    }
}
```

---

#### GET `/listings/<0x_seller>`

**Description**

Get all the listings details sold by a specifc seller.

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| seller | String | Yes | seller wallet address in Base16 format |

**Request Body**

N/A

**Sample Response**

```
{
    success: true,
    result: {
        "_id": "1",
        "token_address": "0xdeadbeef",
        "token_id": "1",
        "seller": "0xcafebabe",
        "price": "10000000000000000000",
        "listing_date": "2020-10-28T23:58:18Z",
        "modified_date": "2020-10-28T23:58:18Z",
    }
}
```

---



### `minting`


### `tokens`


#### GET `/listings/<0x_token_address>/<token_id>`

**Description**

**Request Params**

**Request Body**

N/A

**Sample Response**
