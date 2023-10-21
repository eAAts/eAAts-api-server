const testParamArg = args[0];
const payment = Functions.makeHttpRequest({
  url: `http://18.217.208.178:3000/payment`,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    testParam: testParamArg,
  },
});
const paymentResponse = await payment;
if (paymentResponse.error) {throw Error("Request failed");}
return Functions.encodeString(`data : ${paymentResponse["data"]},status : ${paymentResponse["status"]}`);