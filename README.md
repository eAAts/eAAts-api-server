# eaats-api-server

in this repo we use module
- web3 Stroage(FileCoin)
- the Graph
- chainlink functions

## run in local
1. make an env file with 
```
npm install
npm start
```

2. fill form in .env with each private key

.env
```
PRIVATE_KEY=
RPC_URL_MUMBAI=https://polygon-mumbai.infura.io/v3/
RPC_URL_MATIC=https://polygon-mainnet.infura.io/v3/
NETWORK=TEST
CONSUMER_ADDRESS_MUMBAI=
SUBSCRIPTION_ID_MUMBAI=
CONSUMER_ADDRESS_MATIC=
SUBSCRIPTION_ID_MATIC=
WEB3STORAGE_TOKEN=
```

* in order to fill .env form you need private key of
- web3 strorage (IPFS & filecoin)

- consumer address and subscription id in chainlink functions
https://functions.chain.link/
- our consumer contract is basic consumer example solidity in chainlink functions and deployed with remix in example as you can see in below
https://remix.ethereum.org/#url=https://docs.chain.link/samples/ChainlinkFunctions/FunctionsConsumerExample.sol

## APP List



## Subgraph API with the graph USING THE GRAPH
site : https://thegraph.com/studio/

```
http://localhost:3000/query?entityName=<entityName>&first=<first>&skip=<skip>
```

**Usable entityName**
- orderCreateds
- orderJoineds
- orderDeliveryStarteds
- deliveryCompleteds

## uploading review data with web3 storage USING FILECOIN

image uploaded manually using nftstorage (filecoin)
site : https://nft.storage

and metadata upladed with api using web3.storage module (filecoin)
site : https://web3.storage/
module : https://www.npmjs.com/package/web3.storage

```
  const obj =
  {"name": "eAAts", "description" :`${description}`, "image": `https://${cid}.ipfs.nftstorage.link/`,
  "attributes": [
    {
      "trait_type": "BestMenu", 
      "value": `${vlaue1}`
    }, 
    {
      "trait_type": "Rating", 
      "value": `${value2}`
    },
    {
      "trait_type": "Level", 
      "value": `${value2}`
    }, 
```

## NFT contract
after we uploaded metadat in ipfs we used it in nft
https://mumbai.polygonscan.com/address/0x9EF14100F950d5335301a2d4E8Cc4776cC0115c4#writeContract

this is tokenURI example in IPFS
```
https://bafybeibmwpmwoxve3rlw5eutzwrrbypqoj6lctxgyx533jwmcem4vragga.ipfs.nftstorage.link/metadata.json
```

this is our collection in open sea
https://testnets.opensea.io/collection/eaats