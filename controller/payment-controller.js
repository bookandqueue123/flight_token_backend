const PaymentService = require('../middleware/payment.service');

const paymentInstance = new PaymentService();

 const startPayment = async(req, res) => {
    try{
        const response = await paymentInstance.startPayment(req.body);
        res.status(201).json({status: "Success", data: response});

    }catch(err){
        res.status(500).json({status: "failed", message: err.message});
    }

}
const createPayment = async(req, res) => {
    try{
        const response = await paymentInstance.createPayment(req.body);
        res.status(201).json({status: "Success", data: response});

    }catch(err){
        res.status(500).json({status: "failed", message: err.message});
    }

}
const getPayment = async(req, res) => {
    try{
        const response = await paymentInstance.getPayment(req.body);
        res.status(201).json({status: "Success", data: response});

    }catch(err){
        res.status(500).json({status: "failed", message: err.message});
    }

}
module.exports ={
    startPayment,
    createPayment,
    getPayment
}