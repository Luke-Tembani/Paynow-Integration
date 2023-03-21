const {Paynow} = require("paynow");
const status = require("../functions/getTransationStatus");
require("dotenv").config();

const ID = process.env.PAYNOW_INTEGRATION_ID;
const KEY = process.env.PAYNOW_INTEGRATION_KEY;
let paynow = new Paynow(`${ID}`, `${KEY}`);

function pay(contact, ref, amount,email) {
  const payment = paynow.createPayment(`${ref}`, `${email}`);
  payment.add(`${ref}`, `${amount}`);
  const maxTimeout = 20000; 

  return paynow.sendMobile(payment, `${contact}`, "ecocash")
    .then(async function (response) {
      let initStatus = "Sent";
      const startTime = Date.now();

      return new Promise((resolve, reject) => {
        
        const intervalId = setInterval(async () => {
          try {
            const result = await status.getTransactionStatus(response);
            if (result !== initStatus) {
              clearInterval(intervalId);

              if (result === "Paid") {
                resolve("Paid");
              } else if (result === "Cancelled") {
                resolve("Cancelled");
              } else {
                resolve("Transaction failed")
              }
            } else if (Date.now() - startTime >= maxTimeout) {
              clearInterval(intervalId);
              resolve("Transaction timed out");
            }
          } catch (error) {
            clearInterval(intervalId);
            reject(error);
          }
        }, 2000);
      });
    });
}

  


module.exports = {
    pay:pay
}