const fs = require("fs");
const path = require("path");
const {
  SubscriptionManager,
  ResponseListener,
  ReturnType,
  decodeResult,
} = require("@chainlink/functions-toolkit");
const functionsConsumerAbi = require("./abi.json");
const ethers = require("ethers");
require('dotenv').config();

let consumerAddress; // REPLACE this with your Functions consumer address
let subscriptionId; // REPLACE this with your subscription ID
let routerAddress;
let linkTokenAddress;
let donId;

if(process.env.NETWORK == "TEST") {
  consumerAddress=process.env.CONSUMER_ADDRESS_MUMBAI;
  subscriptionId=process.env.SUBSCRIPTION_ID_MUMBAI;
  routerAddress="0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C"
  linkTokenAddress="0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  donId="fun-polygon-mumbai-1"
}else if(process.env.NETWORK == "MAIN") {
  consumerAddress=process.env.CONSUMER_ADDRESS_MATIC;
  subscriptionId=process.env.SUBSCRIPTION_ID_MATIC;
  routerAddress="0xdc2AAF042Aeff2E68B3e8E33F19e4B9fA7C73F10"
  linkTokenAddress="0xb0897686c545045afc77cf20ec7a532e3120e0f1"
  donId="fun-polygon-mainnet-1"
}

const callSourceCode = async (param) => {
  // hardcoded for Polygon Mumbai
  // Initialize functions settings
  const source = fs
    .readFileSync(path.resolve(__dirname, "source.js"))
    .toString();
  //TODO 여기에 인자 값을 넣어서 넘긴다.
  //넣을 파라미터 값들은 address tokenAddress, address recipient, uint256 amount, uint256 targetChainId
  const args = [param];
  const gasLimit = 300000;

  // Initialize ethers signer and provider to interact with the contracts onchain
  const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
  if (!privateKey)
    throw new Error(
      "private key not provided - check your environment variables"
    );

  const rpcUrl = process.env.RPC_URL_MATIC; // fetch mumbai RPC URL

  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);
  
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider); // create ethers signer for signing transactions

  //////// ESTIMATE REQUEST COSTS ////////
  console.log("\nEstimate request costs...");
  // Initialize and return SubscriptionManager
  const subscriptionManager = new SubscriptionManager({
    signer: signer,
    linkTokenAddress: linkTokenAddress,
    functionsRouterAddress: routerAddress,
  });
  await subscriptionManager.initialize();

  // estimate costs in Juels

  const gasPriceWei = await signer.getGasPrice(); // get gasPrice in wei

  const estimatedCostInJuels =
  await subscriptionManager.estimateFunctionsRequestCost({
    donId: donId, // ID of the DON to which the Functions request will be sent
    subscriptionId: subscriptionId, // Subscription ID
    callbackGasLimit: gasLimit, // Total gas used by the consumer contract's callback
    gasPriceWei: BigInt(gasPriceWei), // Gas price in gWei
  });

  console.log(
    `Fulfillment cost estimated to ${ethers.utils.formatEther(
      estimatedCostInJuels
    )} LINK`
  );

  //////// MAKE REQUEST ////////

  // console.log("\nMake request...");

  const functionsConsumer = new ethers.Contract(
    consumerAddress,
    functionsConsumerAbi,
    signer
  );

  // To simulate the call and get the requestId.
  const requestId = await functionsConsumer.callStatic.sendRequest(
    source, // source
    "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
    0, // don hosted secrets - slot ID - empty in this example
    0, // don hosted secrets - version - empty in this example
    args,
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
    subscriptionId,
    gasLimit,
    ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
  );

  // Actual transaction call
  const transaction = await functionsConsumer.sendRequest(
    source, // source
    "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
    0, // don hosted secrets - slot ID - empty in this example
    0, // don hosted secrets - version - empty in this example
    args,
    [], // bytesArgs - arguments can be encoded off-chain to bytes.
    subscriptionId,
    gasLimit,
    ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
  )

  const result = {
    "requestId" : requestId,
    "transaction" : transaction
  }

  return result;
};

async function decodeData(requestId) {
  console.log("decoding with requestID >>", requestId);
  const rpcUrl = process.env.RPC_URL_MATIC; // fetch mumbai RPC URL

  if (!rpcUrl)
    throw new Error(`rpcUrl not provided  - check your environment variables`);
  
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const responseListener = new ResponseListener({
    provider: provider,
    functionsRouterAddress: routerAddress,
  }); // Instantiate a ResponseListener object to wait for fulfillment.
  console.log("wait for response");

  const response = await new Promise((resolve, reject) => {
    responseListener
      .listenForResponse(requestId)
      .then((response) => {
        console.log(response);
        resolve(response); // Resolves once the request has been fulfilled.
      })
      .catch((error) => {
        console.log(error);
        reject(error); // Indicate that an error occurred while waiting for fulfillment.
      });
  })

  console.log("response is >>", response);

  const errorString = response.errorString;
  if (errorString) {
    console.log(`\n❌ Error during the execution: `, errorString);
  } else {
    const responseBytesHexstring = response.responseBytesHexstring;
    if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
      const decodedResponse = decodeResult(
        response.responseBytesHexstring,
        ReturnType.string
      );
      console.log(
        `\n✅ Decoded response to ${ReturnType.string}: `,
        decodedResponse
      );
      return decodedResponse
    }
  }
}

module.exports = {
  callSourceCode,
  decodeData
}