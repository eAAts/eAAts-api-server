// const fs = require("fs");
// const path = require("path");
// const {
//   SubscriptionManager,
//   SecretsManager,
//   simulateScript,
//   ResponseListener,
//   ReturnType,
//   decodeResult,
//   FulfillmentCode,
// } = require("@chainlink/functions-toolkit");
// const functionsConsumerAbi = require("./abi.json");
// const ethers = require("ethers");
// require('dotenv').config();

// const callSourceCode_post = async (param) => {
//     // hardcoded for Polygon Mumbai
//   const routerAddress = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";
//   const linkTokenAddress = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
//   const donId = "fun-polygon-mumbai-1";
//   const gatewayUrls = [
//     "https://01.functions-gateway.testnet.chain.link/",
//     "https://02.functions-gateway.testnet.chain.link/",
//   ];
//   const explorerUrl = "https://mumbai.polygonscan.com";

//   // Initialize functions settings
//   const source = fs
//     .readFileSync(path.resolve(__dirname, "source_post.js"))
//     .toString();

//   const args = [param];
//   const secrets = { testSecret: "testingSecret" };
//   const slotIdNumber = 0; // slot ID where to upload the secrets
//   const expirationTimeMinutes = 15; // expiration time in minutes of the secrets
//   const gasLimit = 300000;

//   // Initialize ethers signer and provider to interact with the contracts onchain
//   const privateKey = process.env.PRIVATE_KEY; // fetch PRIVATE_KEY
//   if (!privateKey)
//     throw new Error(
//       "private key not provided - check your environment variables"
//     );

//   const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL; // fetch mumbai RPC URL

//   if (!rpcUrl)
//     throw new Error(`rpcUrl not provided  - check your environment variables`);

//   const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

//   const wallet = new ethers.Wallet(privateKey);
//   const signer = wallet.connect(provider); // create ethers signer for signing transactions

//   ///////// START SIMULATION ////////////

//   console.log("Start simulation...");

//   const response = await simulateScript({
//     source: source,
//     args: args,
//     bytesArgs: [], // bytesArgs - arguments can be encoded off-chain to bytes.
//     secrets: secrets,
//   });

//   console.log("Simulation result", response);
//   const errorString = response.errorString;
//   if (errorString) {
//     console.log(`❌ Error during simulation: `, errorString);
//   } else {
//     const returnType = ReturnType.uint256;
//     const responseBytesHexstring = response.responseBytesHexstring;
//     if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
//       const decodedResponse = decodeResult(
//         response.responseBytesHexstring,
//         returnType
//       );
//       console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
//     }
//   }

//   //////// ESTIMATE REQUEST COSTS ////////
//   console.log("\nEstimate request costs...");
//   // Initialize and return SubscriptionManager
//   const subscriptionManager = new SubscriptionManager({
//     signer: signer,
//     linkTokenAddress: linkTokenAddress,
//     functionsRouterAddress: routerAddress,
//   });
//   await subscriptionManager.initialize();

//   // estimate costs in Juels

//   const gasPriceWei = await signer.getGasPrice(); // get gasPrice in wei

//   const estimatedCostInJuels =
//     await subscriptionManager.estimateFunctionsRequestCost({
//       donId: donId, // ID of the DON to which the Functions request will be sent
//       subscriptionId: subscriptionId, // Subscription ID
//       callbackGasLimit: gasLimit, // Total gas used by the consumer contract's callback
//       gasPriceWei: BigInt(gasPriceWei), // Gas price in gWei
//     });

//   console.log(
//     `Fulfillment cost estimated to ${ethers.utils.formatEther(
//       estimatedCostInJuels
//     )} LINK`
//   );

//   //////// MAKE REQUEST ////////

//   console.log("\nMake request...");

//   // First encrypt secrets and upload the encrypted secrets to the DON
//   const secretsManager = new SecretsManager({
//     signer: signer,
//     functionsRouterAddress: routerAddress,
//     donId: donId,
//   });
//   await secretsManager.initialize();

//   // Encrypt secrets and upload to DON
//   const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets);

//   console.log(
//     `Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotIdNumber}. Expiration in minutes: ${expirationTimeMinutes}`
//   );
//   // Upload secrets
//   const uploadResult = await secretsManager.uploadEncryptedSecretsToDON({
//     encryptedSecretsHexstring: encryptedSecretsObj.encryptedSecrets,
//     gatewayUrls: gatewayUrls,
//     slotId: slotIdNumber,
//     minutesUntilExpiration: expirationTimeMinutes,
//   });

//   if (!uploadResult.success)
//     throw new Error(`Encrypted secrets not uploaded to ${gatewayUrls}`);

//   console.log(
//     `\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `,
//     uploadResult
//   );

//   const donHostedSecretsVersion = parseInt(uploadResult.version); // fetch the reference of the encrypted secrets

//   const functionsConsumer = new ethers.Contract(
//     consumerAddress,
//     functionsConsumerAbi,
//     signer
//   );

//   // To simulate the call and get the requestId.
//   const requestId = await functionsConsumer.callStatic.sendRequest(
//     source, // source
//     "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
//     slotIdNumber, // slot ID of the encrypted secrets
//     donHostedSecretsVersion, // version of the encrypted secrets
//     args,
//     [], // bytesArgs - arguments can be encoded off-chain to bytes.
//     subscriptionId,
//     gasLimit,
//     ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
//   );

//   // Actual transaction call
//   const transaction = await functionsConsumer.sendRequest(
//     source, // source
//     "0x", // user hosted secrets - encryptedSecretsUrls - empty in this example
//     slotIdNumber, // slot ID of the encrypted secrets
//     donHostedSecretsVersion, // version of the encrypted secrets
//     args,
//     [], // bytesArgs - arguments can be encoded off-chain to bytes.
//     subscriptionId,
//     gasLimit,
//     ethers.utils.formatBytes32String(donId) // jobId is bytes32 representation of donId
//   );

//   return transaction.hash;
// };

// async function decodeData_post(requestId) {
//   console.log("decoding with requestID >>", requestId);
//   const rpcUrl = process.env.RPC_URL_MATIC; // fetch mumbai RPC URL

//   if (!rpcUrl)
//     throw new Error(`rpcUrl not provided  - check your environment variables`);
  
//   const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
//   const responseListener = new ResponseListener({
//     provider: provider,
//     functionsRouterAddress: routerAddress,
//   }); // Instantiate a ResponseListener object to wait for fulfillment.
//   console.log("wait for response");

//   const response = await new Promise((resolve, reject) => {
//     responseListener
//       .listenForResponse(requestId)
//       .then((response) => {
//         console.log(response);
//         resolve(response); // Resolves once the request has been fulfilled.
//       })
//       .catch((error) => {
//         console.log(error);
//         reject(error); // Indicate that an error occurred while waiting for fulfillment.
//       });
//   })

//   console.log("response is >>", response);

//   const errorString = response.errorString;
//   if (errorString) {
//     console.log(`\n❌ Error during the execution: `, errorString);
//   } else {
//     const responseBytesHexstring = response.responseBytesHexstring;
//     if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
//       const decodedResponse = decodeResult(
//         response.responseBytesHexstring,
//         ReturnType.string
//       );
//       console.log(
//         `\n✅ Decoded response to ${ReturnType.string}: `,
//         decodedResponse
//       );
//       return decodedResponse
//     }
//   }
// }

// module.exports = {
//   callSourceCode_post,
//   decodeData_post
// }