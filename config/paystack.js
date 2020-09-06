require('dotenv').config()

const paystack = (request) => {
    const MySecretKey = `Bearer ${process.env.PAYSTACK_SECRET } `;
   

    const verifyPayment = (ref, mycallback) => {
        const options = {
            url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'    
            }
        }
        const callback = (error, response, body) => {
            return mycallback(error, body)
        }
        request(options, callback)
    }

    return { verifyPayment};
}

module.exports = paystack;