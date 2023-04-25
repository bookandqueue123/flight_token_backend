const request = require('request');
const Payment = require('../models/Payment');
const lodash = require('lodash');

const {initializePayment, verifyPayment} = require('../util/payment')(request);

class PaymentService{
    startPayment(data){
        return new Promise(async(resolve,reject)=>{
            try{
                const form = lodash.pick(data, ['amount', 'email', 'full_name']);
                form.metadata = {
                    full_name: form.full_name
                }
                form.amount *= 100;

                initializePayment(form, (error,body) =>{
                    if(error){
                        reject(error.message)
                    }
                    const response = JSON.parse(body);
                    return resolve(response);
                })

            }catch(error){
                error.source = 'Start Payment Service';
                return reject(error);
            }
        })
    }

    createPayment(data){
        return new Promise(async(resolve,reject)=>{
            try{
                const form = lodash.pick(data, ['amount', 'email', 'full_name']);
                form.metadata = {
                    full_name: form.full_name
                }
                form.amount *= 100;

                initializePayment(form, (error,body) =>{
                    if(error){
                        reject(error.message)
                    }
                    const response = JSON.parse(body);
                    return resolve(response);
                })

            }catch(error){
                error.source = 'Start Payment Service';
                return reject(error);
            }
        })
    }

    paymentReceipt(data){
        return new Promise(async(resolve,reject)=>{
            try{
                const form = lodash.pick(data, ['amount', 'email', 'full_name']);
                form.metadata = {
                    full_name: form.full_name
                }
                form.amount *= 100;

                initializePayment(form, (error,body) =>{
                    if(error){
                        reject(error.message)
                    }
                    const response = JSON.parse(body);
                    return resolve(response);
                })

            }catch(error){
                error.source = 'Start Payment Service';
                return reject(error);
            }
        })
    }
}