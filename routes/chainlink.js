const express = require('express');
const { callSourceCode, decodeData } = require('../controllers/chainlink/request');
const router = express.Router();

router.get('/', async function(req, res, next) {
    const tokenAddressArg = req.query.tokenAddress;
    const amountArg = req.query.amount;
    const targetChainIdArg = req.query.targetChainId;

    const callRes = await callSourceCode(tokenAddressArg,amountArg,targetChainIdArg);
    console.log("functions tx is >>", callRes.transaction);
    console.log("functions requestId is >>", callRes.requestId);
    const decodedData = await decodeData(callRes.requestId);
    console.log("decodedData is >>", decodedData);

    res.render(decodedData);
  });

//   router.post('/post', async function(req, res, next) {
//     const testResponse = req.query.testParam;
//     const callRes = await callSourceCode(testResponse);
//     console.log("functions tx is >>", callRes.transaction);
//     console.log("functions requestId is >>", callRes.requestId);
//     const decodedData = await decodeData(callRes.requestId);
//     console.log("decodedData is >>", decodedData);

//     res.render(decodedData);
//   });
  
module.exports = router;
