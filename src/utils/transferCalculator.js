export const calculateTransfer = ({
  sendAmount,
  fromCurrency,
  toCurrency,
  rates,
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

  // 1️⃣ Service Fee (2%)
  const serviceFee = amount * 0.02;

  // 2️⃣ Subtotal (Amount + Service Fee)
  const subTotal = amount + serviceFee;

  // 3️⃣ GST (15% on Subtotal)
  const gst = subTotal * 0.15;

  // 4️⃣ Total To Pay
  const totalToPay = subTotal + gst;

  // 5️⃣ Receiver Gets (Only based on send amount)
  const receiveAmount = amount * rate;

  return {
    serviceFee: serviceFee.toFixed(2),
    subTotal: subTotal.toFixed(2),
    gst: gst.toFixed(2),
    totalToPay: totalToPay.toFixed(2),
    receiveAmount: receiveAmount.toFixed(2),
  };
};
