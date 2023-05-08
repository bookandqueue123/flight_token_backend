const paystack = (request) =>{
    const MySecretKey = process.env.PAYSTACK_SECRET_KEY

    const initializePayment = (form, mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            headers:{
                authorization: MySecretKey,
                'content-type': 'appplication/json',
                'cache-control': 'no-cache'
            },
            form
        }
        const callback = (error,response,body) => {
            return mycallback(error, body);
        }
        request.post(options,callback);

    }
    // const Paystack = require('paystack');
    // const paystack = new Paystack('PAYSTACK_SECRET_KEY');
    // const paymentData= {
    //     //         url: 'https://api.paystack.co/transaction/initialize',
        
    // amount: 5000,
    // email:"riliwanademola@yahoo.com",
    // reference: "7PVGX8MEk85tgeEpVDtD",
    // callback_url: 'https://api.paystack.co/transaction/initialize'


    // };
    // paystack.transaction.initialize(paymentData, (error, body) => {
    //     if (error) {
    //       console.error(error);
    //     } else {
    //       console.log(body.data.authorization_url);
    //     }
    //   });

    const verifyPayment = (ref,mycallback) => {
        const options = {
            url: 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
            headers:{
                authorization: MySecretKey,
                'content-type': 'appplication/json',
                'cache-control': 'no-cache'
            }

    }
    const callback = (error,response,body) => {
        return mycallback(error, body);
    }
    request.post(options,callback);

}
        return(initializePayment, verifyPayment);
}

module.exports = paystack;