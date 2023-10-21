// // No authentication. demonstrate POST with data in body
// // callgraphql api: https://github.com/trevorblades/countries
// // docs: https://trevorblades.github.io/countries/queries/continent

// // make HTTP request
// const url = "http://18.217.208.178:3000/payment";
// const postRequest = Functions.makeHttpRequest({
//   url: url,
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   data: {
//     testParam : secrets.testSecret
//   },
// });

// // Execute the API request (Promise)
// const postResponse = await postRequest;
// if (postResponse.error) {
//   console.error(postResponse.error);
//   throw Error(postResponse);
// }
// return Functions.encodeString(
//   `
//   data : ${postResponse["data"]}
//   status : ${postResponse["status"]}
//   `
// );