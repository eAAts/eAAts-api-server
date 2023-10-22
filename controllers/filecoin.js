const {Web3Storage,File} = require("web3.storage");
require('dotenv').config();
function makeFileObjectsMetaData(cid, description,vlaue1,value2) {
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
  ]};

  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

  const files = [
    new File([blob], 'metadata.json')
  ]

  console.log("files: ",files)

  return files
}

const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;
async function storeMetadata (cid, description,vlaue1,value2) {
  const files = makeFileObjectsMetaData(cid, description,vlaue1,value2);
    const client = new Web3Storage({ token: WEB3STORAGE_TOKEN });
    const cid_metadata = await client.put(files)
    console.log("cid_metadata >>", cid_metadata);
    return cid_metadata
}

// exampel of minting ipfs
// const good_review = "The hamburger was absolutely delicious! The patty was juicy and flavorful, and the bun was soft and fluffy. I really enjoyed the combination of fresh lettuce, ripe tomatoes, and the chef's special sauce. The portion size was just right, and the presentation was appealing. Overall, it was a satisfying meal that I would recommend to anyone looking for a good hamburger."
// const good_review2 = "GOAT!! best burger of my life"
// const good_review3 = "I can eat this all day"

// const bad_review = "It was awful!!!"
// const bad_review2 = "too slaty too late :("

// const img1 = "bafkreibotazilhq4e7pqmh55rglme3iplic3lx6sby6q3k5yyco7xhmu4q";
// const img2 = "bafkreifwhje6xobr3uqizgw7j44pljual7rkokhgr3hb2xgiclw3fr6dle"
// const img3 = "bafkreiccqgdon7qqkcy3skuvd57jtaerohssvhldv372ji64aokthalkte"
// const img4 = "bafkreib3ip2x6tfpy5jnneh64yrle25wozvgsr6fqhqxfs2rt2uilzlkpy"
// const img5 = "bafkreihycrb56yxccdw7doubj2m7snzr4alnwys5i36fgfd6uyjfcvllla"

// storeMetadata(img3,bad_review,"hamBurger",1)
// storeMetadata(img3,good_review,"hamBurger",10)
// storeMetadata(img3,good_review3,"specialBurger",9)
// storeMetadata(img5,bad_review2,"specialBurger",2)
// storeMetadata(img4,good_review3,"specialSet",7)
module.exports = {
    storeMetadata
}
