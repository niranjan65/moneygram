import React, { useState, useCallback } from 'react';
import { Stepper } from '../components/Stepper';
import { Summary } from '../components/Summary';
import { SenderCard } from '../components/SenderCard';
import { ReceiverForm } from '../components/RecieverForm';
import { ReviewStep } from '../components/ReviewStep';
import Navbar from '../components/layout/Navbar';
import { TransferSuccess } from '../components/TransferSuccess';

const Step = {
  ESTIMATE: 1,
  DETAILS:  2,
  PAYMENT:  3,
  REVIEW:   4,
};

const TRANSFER_FEE = 4.99;

const MoneyExchange = () => {
  const [currentStep, setCurrentStep] = useState(Step.DETAILS);


  const [senderInfo] = useState({
    name:  'Niranjan Singh',
    email: 'niranjan.ks@anantdv.com',
    phone: '+91 1234567890',
  });

  const [receiverInfo, setReceiverInfo] = useState({
    firstName:        '',
    lastName:         '',
    country:          'Spain',
    city:             '',
    deliveryMethod:   'BANK_DEPOSIT',
    bankName:         '',
    accountNumber:    '',
    senderCurrency:   'USD',
    receiverCurrency: 'EUR',
  });

  const [summary, setSummary] = useState({
    sendAmount:       1000.00,
    currency:         'USD',
    fee:              TRANSFER_FEE,
    exchangeRate:     0.92,
    receiverGets:     920.00,
    receiverCurrency: 'EUR',
  });

  // Full transfer payload saved when ReceiverForm submits — used by ReviewStep
  const [transferPayload, setTransferPayload] = useState(null);

  const [transactionId, setTransactionId] = useState(null);

  const handleSummaryChange = useCallback((incoming) => {
    setSummary(prev => ({
      ...prev,
      sendAmount:       incoming.sendAmount,
      currency:         incoming.currency,
      exchangeRate:     incoming.exchangeRate,
      receiverGets:     incoming.receiverGets,
      receiverCurrency: incoming.receiverCurrency,
    }));
  }, []);

  // Called when ReceiverForm hits Continue — save full payload and go to REVIEW
  const handleContinue = useCallback((data) => {
    setReceiverInfo(data);
    setTransferPayload(data);
    console.log('Transfer payload:', data);

    setSummary(prev => ({
      ...prev,
      sendAmount:       data.sendAmount,
      currency:         data.senderCurrency,
      exchangeRate:     data.exchangeRate,
      receiverGets:     data.receiverGets,
      receiverCurrency: data.receiverCurrency,
    }));

    // Go to REVIEW (step 4) instead of PAYMENT
    setCurrentStep(Step.REVIEW);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(Step.ESTIMATE, prev - 1));
  }, []);

  // Called from ReviewStep → Edit buttons → go back to DETAILS
  const handleEditFromReview = useCallback(() => {
    setCurrentStep(Step.DETAILS);
  }, []);

  // Called from ReviewStep → Confirm & Send → go to PAYMENT
  const handleConfirm = useCallback(() => {
    const txId = `#TRX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTransactionId(txId);
    setCurrentStep(Step.PAYMENT);
    // TODO: trigger your actual payment / API call here
    console.log('Confirmed! Proceeding to payment with:', transferPayload);
  }, [transferPayload]);

   const handleDashboard = useCallback(() => {
    // TODO: navigate to dashboard route
    console.log('Navigate to dashboard');
  }, []);

  const handleDownloadReceipt = useCallback(() => {
    // TODO: generate PDF receipt
    console.log('Download receipt for:', transactionId);
  }, [transactionId]);

  // ── Step content ─────────────────────────────────────────────────────────────
  const renderStepContent = () => {
    if (currentStep === Step.REVIEW) {
      return (
        <ReviewStep
          data={transferPayload}
          senderName={senderInfo.name}
          paymentLabel="Visa •••• 4242"
          fee={TRANSFER_FEE}
          onEdit={handleEditFromReview}
          onCancel={handleBack}
          onConfirm={handleConfirm}
        />
      );
    }

    if (currentStep === Step.PAYMENT) {
      
      return (
        <TransferSuccess
            data={transferPayload}
            transactionId={transactionId}
            estimatedArrival="Today by 5:00 PM"
            onDashboard={handleDashboard}
            onDownloadReceipt={handleDownloadReceipt}
          />
      );
    }

    // Default: DETAILS step (ReceiverForm)

    console.log("current step", currentStep)
    return (
      <>
        <SenderCard sender={senderInfo} />

        <ReceiverForm
          initialData={receiverInfo}
          sendAmount={summary.sendAmount}
          onContinue={handleContinue}
          onBack={handleBack}
          onSummaryChange={handleSummaryChange}
        />

        <div className="text-gray-400 text-xs font-semibold max-w-2xl px-2 leading-relaxed">
          By clicking continue, you agree to MoneyFlow's Terms of Service and Privacy Policy.
          Funds are usually delivered within minutes, subject to bank processing times and
          holiday schedules in the destination country.
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">

          <Stepper currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── Main Form Column ── */}
            <div className="lg:col-span-8 flex flex-col gap-10">

              {/* Header — hide on Review/Payment since ReviewStep has its own header */}
              {currentStep === Step.DETAILS && (
                <div className="flex flex-col gap-3">
                  <h1 className="text-gray-900 text-3xl sm:text-5xl font-black tracking-tight leading-none">
                    Who are you sending{' '}
                    <span className="text-primary italic">money</span> to?
                  </h1>
                  <p className="text-primary font-black text-sm uppercase tracking-widest opacity-80">
                    Step {currentStep}: Recipient Information
                  </p>
                </div>
              )}

              {renderStepContent()}
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-4 relative">
              <Summary summary={summary} />
            </div>

          </div>
        </div>
      </main>

      <footer className="py-8 px-10 border-t border-gray-100 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
        © 2026 MoneyGram Technologies Inc. • Built for Secure Global Commerce
      </footer>
    </div>
  );
};

export default MoneyExchange;