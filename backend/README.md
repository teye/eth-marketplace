# Backend

## API Routes

- **Listings**
  - [Get all listings](#get-listings)
  - [Get a specific listings by token address and token id pair](#get-listings0x_token_addresstoken_id)
  - [Get all the listings listed by a seller](#get-listings0x_seller)
  - [Delete listing](#delete-listings0x_token_addresstoken_id)
  - [Add listing](#post-listings)
  - [Update listing](#put-listings0x_token_addresstoken_id)
- **Minting**
  - [Upload image and metadata to IPFS](#post-minting)
- **Tokens**
  - [Get all nfts](#get-tokens)
  - [Get all nfts minted by a wallet](#get-tokensminted0x_wallet)
  - [Get all nfts owned by a wallet](#get-tokensowned0x_token_addresstoken_id)
  - [Get nft details by token address and token id pair](#get-tokens0x_token_addresstoken_id)
  - [Add a newly minted nft](#post-tokens)
  - [Update nft details](#put-tokens0x_token_addresstoken_id)


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

Routes relating to uploading NFT and its metadata to a decentralized storage.

#### POST `/minting`

**Description**
<br>
Uploads the user image and metadata to IPFS.

**Request Body**
<br>
Multipart Form
|  Key  |  Value | Content Type | Description |
| ------ | ----- | -------- | ----------- |
| files | <filename.jpg> | Auto | User uploaded file in Blob format |
| name | <nft_name> | Auto | Name of the NFT |
| description | <nft_description> | Auto | Description of the NFT |
| attributes | ```[{ "trait_type": "", "value": "" }]``` | application/json | NFT metadata |

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": {
            "imgIPFSHash": "QmdwUTgYuvApiWvytVszNtadcg8W899M4VwMVReDYNbkZT",
            "metadataIPFSHash": "QmXVkJPTMFk7mXVk9M3npDnf1KeF3aRqELq4dqeTGkQWda"
        }
    }
</details>

---


### `tokens`

Routes relating to NFT token details.

#### GET `/tokens`

**Description**
<br>
Get all nfts minted on the marketplace.

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": [
            {
                "_id": "62cbe1f561b9acb975d60f29",
                "token_address": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
                "token_id": "1",
                "token_name": "Apple",
                "token_uri": "https://gateway.pinata.cloud/ipfs/QmS9aoTd5aXF42TQZhhbm6it3nXtgScrFqLneQhy7iSQbm",
                "minter": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "owner": "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
                "minted_date": "2022-07-11T08:40:21.736Z",
                "modified_date": "2022-07-11T08:40:58.191Z"
            }
        ]
    }
</details>

---

#### GET `/tokens/minted/<0x_wallet>`

**Description**
<br>
Get all nfts **minted** by a particular wallet.

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": [
            {
                "_id": "62cbe1f561b9acb975d60f29",
                "token_address": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
                "token_id": "1",
                "token_name": "Apple",
                "token_uri": "https://gateway.pinata.cloud/ipfs/QmS9aoTd5aXF42TQZhhbm6it3nXtgScrFqLneQhy7iSQbm",
                "minter": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "owner": "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
                "minted_date": "2022-07-11T08:40:21.736Z",
                "modified_date": "2022-07-11T08:40:58.191Z"
            }
        ]
    }
</details>

---

#### GET `/tokens/owned/<0x_wallet>`

**Description**
<br>
Get all nfts **owned** by a particular wallet.

**Request Body**
<br>
N/A

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": [
            {
                "_id": "62cbe1f561b9acb975d60f29",
                "token_address": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
                "token_id": "1",
                "token_name": "Apple",
                "token_uri": "https://gateway.pinata.cloud/ipfs/QmS9aoTd5aXF42TQZhhbm6it3nXtgScrFqLneQhy7iSQbm",
                "minter": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "owner": "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
                "minted_date": "2022-07-11T08:40:21.736Z",
                "modified_date": "2022-07-11T08:40:58.191Z"
            }
        ]
    }
</details>

---

#### GET `/tokens/<0x_token_address>/<token_id>`

**Description**
<br>
Get nft details by token address and token id pair.

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
        "result": [
            {
                "_id": "62cbe1f561b9acb975d60f29",
                "token_address": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
                "token_id": "1",
                "token_name": "Apple",
                "token_uri": "https://gateway.pinata.cloud/ipfs/QmS9aoTd5aXF42TQZhhbm6it3nXtgScrFqLneQhy7iSQbm",
                "minter": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "owner": "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
                "minted_date": "2022-07-11T08:40:21.736Z",
                "modified_date": "2022-07-11T08:40:58.191Z"
            }
        ]
    }
</details>

---

#### POST `/tokens`

**Description**
<br>
Add a newly minted NFT.

**Request Body**
```
{
    "token_address": "<0x_nft_token_address>",
    "token_id": "<nft_token_id>",
    "token_name": "<nft_name>",
    "token_uri": "<nft-metadata-url or image url>",
    "minter": "<0x_minter_address>",
    "owner": "<0x_owner_address>"
}
```

<details>
    <summary><b>Sample Response</b></summary>

    {
        "success": true,
        "result": [
            {
                "_id": "62cbe1f561b9acb975d60f29",
                "token_address": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
                "token_id": "1",
                "token_name": "Apple",
                "token_uri": "https://gateway.pinata.cloud/ipfs/QmS9aoTd5aXF42TQZhhbm6it3nXtgScrFqLneQhy7iSQbm",
                "minter": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "owner": "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
                "minted_date": "2022-07-11T08:40:21.736Z",
                "modified_date": "2022-07-11T08:40:58.191Z"
            }
        ]
    }
</details>

---

#### PUT `/tokens/<0x_token_address>/<token_id>`

**Description**
<br>
Update the token entry, e.g updating the owner when it changed hands

**Request Params**
|  Name  |  Type | Required | Description |
| ------ | ----- | -------- | ----------- |
| token_address | String | Yes | NFT token address in Base16 format |
| token_id | String | Yes | NFT token ID |

**Request Body**
```
{
    "owner": "0xnewowner"
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
                "_id": "62cd2577bda884afe6f3401c",
                "token_address": "0x123",
                "token_id": "1",
                "token_name": "basic nft",
                "token_uri": "http://api-metadata-url.com",
                "minter": "0xdeadbeef",
                "owner": "0xdeadbeef",
                "minted_date": "2022-07-12T07:40:39.370Z",
                "modified_date": "2022-07-12T07:40:39.370Z"
            },
            "ok": 1,
            "$clusterTime": {
                "clusterTime": {
                    "$timestamp": "7119388487643562011"
                },
                "signature": {
                    "hash": "f+9RkILo2hnXfE0x3wBArPiQWu0=",
                    "keyId": {
                        "low": 11,
                        "high": 1643310689,
                        "unsigned": false
                    }
                }
            },
            "operationTime": {
                "$timestamp": "7119388487643562011"
            }
        }
    }
</details>


#### GET `/listings/<0x_token_address>/<token_id>`

**Description**
<br>

**Request Params**

**Request Body**
<br>
N/A

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
