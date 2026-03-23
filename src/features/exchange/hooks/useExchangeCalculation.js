import { useMemo, useState, useEffect } from 'react';

export const useExchangeCalculation = ({
  availableCurrencies,
  externalSendAmount,
  noDataForToday,
  onSummaryChange,
  exchangeType,
}) => {
  
  const [toCurrency, setToCurrency] = useState(null);
  const [manualRate, setManualRate] = useState('');
  const [useManualRate, setUseManualRate] = useState(false);
  const [sendAmount, setSendAmount] = useState(externalSendAmount ?? 1000);
  const [sendAmountError, setSendAmountError] = useState('');

  // Auto-select first available currency
  useEffect(() => {
    if (availableCurrencies?.length && !toCurrency) {
      setToCurrency(availableCurrencies[0]);
    }
  }, [availableCurrencies, toCurrency]);

  // Handle fallback if no data for today
  useEffect(() => {
    if (noDataForToday) setUseManualRate(true);
  }, [noDataForToday]);

  // Determine the effective rate
  const effectiveRate = useMemo(() => {
    if (!toCurrency) return null;
    if (useManualRate) { 
      const m = parseFloat(manualRate); 
      return !isNaN(m) && m > 0 ? m : null; 
    }
    if (exchangeType === 'SELL') return toCurrency.sellingRate ?? null;
    if (exchangeType === 'BUY')  return toCurrency.buyingRate  ?? null;
    return null;
  }, [toCurrency, exchangeType, useManualRate, manualRate]);

  // Calculate the preview exchange result
  const exchangePreview = useMemo(() => {
    if (!effectiveRate || effectiveRate <= 0) return null;
    if (!sendAmount || sendAmount <= 0) return null;
    
    let receiverAmount = 0;
    if (exchangeType === 'BUY') {
      receiverAmount = sendAmount * effectiveRate;
    }
    if (exchangeType === 'SELL') { 
      receiverAmount = sendAmount * effectiveRate; 
    }
    
    receiverAmount = Math.round((receiverAmount + Number.EPSILON) * 100) / 100;
    return { 
      rate: effectiveRate, 
      rawAmount: receiverAmount,
      formatted: receiverAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
    };
  }, [effectiveRate, sendAmount, exchangeType]);

  // Trigger onSummaryChange whenever inputs change
  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange({
      sendAmount, 
      currency: 'FJD',
      exchangeRate: exchangePreview?.rate ?? 0, 
      receiverGets: exchangePreview?.rawAmount ?? 0,
      receiverCurrency: toCurrency?.code ?? '', 
      exchangeType,
    });
  }, [sendAmount, toCurrency, exchangePreview, exchangeType, onSummaryChange]);

  return {
    toCurrency,
    setToCurrency,
    manualRate,
    setManualRate,
    useManualRate,
    setUseManualRate,
    sendAmount,
    setSendAmount,
    sendAmountError,
    setSendAmountError,
    effectiveRate,
    exchangePreview,
  };
};
