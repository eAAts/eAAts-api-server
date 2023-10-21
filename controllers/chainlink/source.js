const tokenAddressArg = args[0];
const amountArg = args[1];
const targetChainIdArg = args[2];
const payment = Functions.makeHttpRequest({
  url: `http://18.217.208.178:3000/payment`,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    tokenAddress: tokenAddressArg,
    amount: amountArg,
    targetChainId: targetChainIdArg,
  },
});
const paymentResponse = await payment;
if (paymentResponse.error) {throw Error("Request failed");}
return Functions.encodeString(`data : ${paymentResponse["data"]},status : ${paymentResponse["status"]}`);