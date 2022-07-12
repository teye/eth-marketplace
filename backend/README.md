# Backend

## API Routes

### `listings`

#### GET `/listings/`

**Description**
Retrieves the list of nfts sold on the marketplace.

**Request Body**
N/A

**Sample Response**
```
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
```

### `minting`


### `tokens`
