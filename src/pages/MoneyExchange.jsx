
import React, { useState, useCallback } from 'react';
import { Stepper } from '../components/Stepper';
import { Summary } from '../components/Summary';
import { SenderCard } from '../components/SenderCard';
import { ReceiverForm } from '../components/RecieverForm';
import Navbar from '../components/layout/Navbar';

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
    name:  'Michael Johnson',
    email: 'm.johnson@example.com',
    phone: '+1 (555) 123-4567',
  });

  // Receiver form initial defaults
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

 
  const handleContinue = useCallback((data) => {
    // Persist everything the next steps will need
    setReceiverInfo(data);
    console.log(data);
    
    setSummary(prev => ({
      ...prev,
      sendAmount:       data.sendAmount,
      currency:         data.senderCurrency,
      exchangeRate:     data.exchangeRate,
      receiverGets:     data.receiverGets,
      receiverCurrency: data.receiverCurrency,
    }));

    setCurrentStep(Step.PAYMENT);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(Step.ESTIMATE, prev - 1));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">

          <Stepper currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── Main Form Column ── */}
            <div className="lg:col-span-8 flex flex-col gap-10">

              <div className="flex flex-col gap-3">
                <h1 className="text-gray-900 dark:text-white text-3xl sm:text-5xl font-black tracking-tight leading-none">
                  Who are you sending <span className="text-primary italic">money</span> to?
                </h1>
                <p className="text-primary font-black text-sm uppercase tracking-widest opacity-80">
                  Step 02: Recipient Information
                </p>
              </div>

              <SenderCard sender={senderInfo} />

              <ReceiverForm
                initialData={receiverInfo}
                sendAmount={summary.sendAmount}   // pass current summary amount as starting value
                onContinue={handleContinue}
                onBack={handleBack}
                onSummaryChange={handleSummaryChange}  // ← live sidebar updates
              />

              <div className="text-gray-400 dark:text-gray-600 text-xs font-semibold max-w-2xl px-2 leading-relaxed">
                By clicking continue, you agree to MoneyFlow's Terms of Service and Privacy Policy.
                Funds are usually delivered within minutes, subject to bank processing times and
                holiday schedules in the destination country.
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-4 relative">
              {/*
                Summary now receives live-updated numbers.
                Make sure your <Summary> component reads these props:
                  summary.sendAmount       — what the sender types
                  summary.currency         — sender currency code
                  summary.fee              — fixed transfer fee
                  summary.exchangeRate     — live calculated rate
                  summary.receiverGets     — converted amount
                  summary.receiverCurrency — receiver currency code
              */}
              <Summary summary={summary} />
            </div>

          </div>
        </div>
      </main>

      <footer className="py-8 px-10 border-t border-gray-100 dark:border-gray-800 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
        © 2024 MoneyGram Technologies Inc. • Built for Secure Global Commerce
      </footer>
    </div>
  );
};

export default MoneyExchange;