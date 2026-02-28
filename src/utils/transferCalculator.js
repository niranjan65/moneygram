// //transferCalculator.js
// export const calculateTransfer = ({
//   sendAmount,
//   fromCurrency,
//   toCurrency,
//   rates,
//   gstPercent, 
// }) => {
//   const amount = parseFloat(sendAmount);

//   if (!amount || !rates[fromCurrency]?.[toCurrency]) {
//     return {
//       serviceFee: 0,
//       subTotal: 0,
//       gst: 0,
//       totalToPay: 0,
//       receiveAmount: 0,
//     };
//   }

//   const rate = rates[fromCurrency][toCurrency];

//   // 1️⃣ Service Fee (2%)
//   const serviceFee = amount * 0.02;

//   // 2️⃣ Subtotal
//   const subTotal = amount + serviceFee;

//   // 3️⃣ GST (Dynamic from ERP)
//   const gst = subTotal * (gstPercent / 100);

//   // 4️⃣ Total To Pay
//   const totalToPay = subTotal + gst;

//   // 5️⃣ Receiver Gets
//   const receiveAmount = amount * rate;

//   return {
//     serviceFee: serviceFee.toFixed(2),
//     subTotal: subTotal.toFixed(2),
//     gst: gst.toFixed(2),
//     totalToPay: totalToPay.toFixed(2),
//     receiveAmount: receiveAmount.toFixed(2),
//   };
// };
export const calculateTransfer = ({
  sendAmount,
  fromCurrency,
  toCurrency,
  rates,
  gstPercent,
}) => {
  const amount = parseFloat(sendAmount);

  if (!amount || !rates[fromCurrency]?.[toCurrency]) {
    return {
      serviceFee: 0,
      subTotal: 0,
      gst: 0,
      totalToPay: 0,
      receiveAmount: 0,
    };
  }

  const rate = rates[fromCurrency][toCurrency];

  // 1️⃣ Receiver Gets (conversion first)
  const receiveAmount = amount * rate;

  // 2️⃣ Service Fee (2% of receive amount)
  const serviceFee = receiveAmount * 0.02;

  // 3️⃣ GST (only on service fee)
  const gst = serviceFee * (gstPercent / 100);

  // 4️⃣ Subtotal (Send Amount + Service Fee)
  const subTotal = amount + serviceFee;

  // 5️⃣ Total To Pay (Send + Fee + GST)
  const totalToPay = amount + serviceFee + gst;

  return {
    serviceFee: serviceFee.toFixed(2),
    subTotal: subTotal.toFixed(2),
    gst: gst.toFixed(2),
    totalToPay: totalToPay.toFixed(2),
    receiveAmount: receiveAmount.toFixed(2),
  };
};