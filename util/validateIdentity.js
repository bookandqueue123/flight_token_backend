// const axios = require('axios')
// let token
//  exports.getToken = () => {
//     const options = {
//         method: 'POST',
//         url: 'https://apps.qa.interswitchng.com/passport/oauth/token?grant_type=client_credentials',
//         headers: {
//           accept: 'application/json',
//           Authorization: 'Basic SUtJQUYxQ0JCQUVGMzRBMDREMjYwNjUxMzM2ODFCMEVCM0M5OTZDREQ0NjU6SWR6MTVta2Z1V3J4Qjhr',
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       };
      
//      return  axios
//         .request(options)
//         .then(function (response) {
//         token = response.data.access_token; 
//           return response.data;
//         })
//         .catch(function (error) {
//           return error;
//         });
// }



// exports.sendRequest =  async () =>  {
//     const options = {
//       method: 'POST',
//       url: 'https://sandbox.interswitchng.com//',
//       headers: {
//         accept: 'application/json',
//         'content-type': 'application/json',
//         authorization: `Bearer ${token}` // use the token in the authorization header
//       },
//       data: {
//         verificationRequests: [{type: 'BVN', identityNumber: '22297324735'}],
//         type: 'INDIVIDUAL',
//         phone: '08124396303',
//         lastName: 'Salami',
//         firstName: 'Riliwan',
//         birthDate: '1995-05-29',
//         gender: 'male',
//         callbackUrl: 'http://facebook.com'
//       }
//     };
  
//     try {
//       const response = await axios.request(options);
//       console.log('Request sent successfully:', response.data);
//     } catch (error) {
//       console.error('Error sending request:', error);
      
//     }
//   }
  

//   const axios = require('axios');

// const options = {
//   method: 'GET',
//   url: 'https://sandbox.interswitchng.com/api/v1/inquiry/bank-code/SORT_CODE/account/ACCOUNT_NUMBER',
//   headers: {
//     accept: 'application/json',
//     authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiYXJiaXRlciIsImlzdy1jb2xsZWN0aW9ucyIsImlzdy1jb3JlIiwiaXN3LXBheW1lbnRnYXRld2F5IiwicGFzc3BvcnQiLCJwcm9qZWN0LXgtbWVyY2hhbnQiLCJ2YXVsdCJdLCJtZXJjaGFudF9jb2RlIjoiTVgxMzc0MzgiLCJzY29wZSI6WyJwcm9maWxlIl0sImV4cCI6MTY4NDAxNzk1MywiY2xpZW50X25hbWUiOiJXMWtUUkdhNFdIbUJyK3N4cHdoRGJjUWZGTlcvSHpWaGQzaVk1R3NHQmFneDdpWDNJM3pqdUtJWlRDY2g4OExHX01YMTM3IiwianRpIjoiZGU1OTBlZDUtNjMxZC00Yjg1LWIwYTYtNWZiYWMyZGY4MTE1IiwicGF5YWJsZV9pZCI6IjExNDI2OSIsImNsaWVudF9pZCI6IklLSUFGMUNCQkFFRjM0QTA0RDI2MDY1MTMzNjgxQjBFQjNDOTk2Q0RENDY1In0.euhhkEShzGi_OWtJyDqf4ZiaO4O6-puOWB3v6ZHG5HYB1Kw4e8LhXmlRcOWEZd-oPx_N2YQONRvSe9_ztJhyC-XDQZNNGBD_1EuZp376CKTbXZ9IawMr62G7ajsvuS0yBCQDbQp1fnnwtrdgoQB1L0IvFBUAO-6DyqOH311kMVjZpX81HCfRNcKxddTx2yqknM7it6kePpZWpUFkQHVG2F4pu8v815KNjtQs4yvxyjvHZRed-5O1uh6RhgPcaAsXVnxNXeveKeffs2DOUTebRHEJZ7IqjaGYU_qu39em2ZfX-ntx7wM_CX27M_Cs1FvhVJ9fm51iLURjtgnrHNPbDw'
//   }
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });