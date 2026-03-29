import React, { useState, useCallback } from 'react';
import { Stepper } from '../components/Stepper';
import { Summary } from '../components/Summary';
import { SenderCard } from '../components/SenderCard';
import { ReceiverForm } from '../features/exchange/components/ReceiverForm';
import { ReviewStep } from '../components/ReviewStep';
import Navbar from '../components/layout/Navbar';
import { TransferSuccess } from '../components/TransferSuccess';
import { useERPFileUpload } from '../hooks/useERPFileUpload';
import { ExchangeProvider } from '../context/ExchangeContext';
import { useSettings } from '../context/SettingsContext';
import { useERPNextRates } from '../hooks/useERPNextRates';
import { CheckCircle2 } from 'lucide-react';

const Step = {
  ESTIMATE: 1,
  DETAILS: 2,
  REVIEW: 3,
  PAYMENT: 4,
};

const TRANSFER_FEE = 4.99;



const MoneyExchange = () => {
  const { uploadFile } = useERPFileUpload();
  const ratesData = useERPNextRates();

  const [currentStep, setCurrentStep] = useState(Step.DETAILS);


  const [senderInfo] = useState({
    name: 'Niranjan Singh',
    email: 'niranjan.ks@anantdv.com',
    phone: '+91 1234567890',
  });

  const { selectedWarehouse} = useSettings();

  const [receiverInfo, setReceiverInfo] = useState({
    firstName: '',
    lastName: '',
    country: 'Spain',
    city: '',
    deliveryMethod: 'BANK_DEPOSIT',
    bankName: '',
    accountNumber: '',
    senderCurrency: 'USD',
    receiverCurrency: 'EUR',
  });

  const [summary, setSummary] = useState({
    sendAmount: 1000.00,
    currency: 'USD',
    fee: TRANSFER_FEE,
    exchangeRate: 0.02,
    receiverGets: 920.00,
    receiverCurrency: 'EUR',
    exchangeType: 'BUY',
  });

  // Full transfer payload saved when ReceiverForm submits — used by ReviewStep
  const [transferPayload, setTransferPayload] = useState(null);

  const [transactionId, setTransactionId] = useState(null);

  // Stores the created Currency Exchange For Customer doc from ERPNext API
  const [apiResponseDoc, setApiResponseDoc] = useState(null);

  const handleSummaryChange = useCallback((incoming) => {

    console.log("handle summary change called.........", incoming)
    setSummary(prev => ({
      ...prev,
      sendAmount: incoming.sendAmount,
      currency: incoming.currency,
      exchangeRate: incoming.exchangeRate,
      receiverGets: incoming.receiverGets,
      fee: incoming.receiverGets * 0.02,
      receiverCurrency: incoming.receiverCurrency,
      exchangeType: incoming.exchangeType,
    }));
  }, []);

  // Called when ReceiverForm hits Continue — save full payload and go to REVIEW
  const handleContinue = useCallback((data) => {
    setReceiverInfo(data);
    setTransferPayload(data);
    console.log('Transfer payload:', data);

    setSummary(prev => ({
      ...prev,
      sendAmount: data.sendAmount,
      currency: data.senderCurrency,
      exchangeRate: data.exchangeRate,
      receiverGets: data.receiverGets,
      receiverCurrency: data.receiverCurrency,
    }));

    // Go to REVIEW (step 4) instead of PAYMENT
    setCurrentStep(Step.REVIEW);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep(prev => Math.max(Step.ESTIMATE, prev - 1));
  }, []);

  // Called from ReviewStep → Cancel → reset everything and go back to DETAILS
  const handleCancel = useCallback(() => {
    setReceiverInfo({
      firstName: '',
      lastName: '',
      country: 'Spain',
      city: '',
      deliveryMethod: 'BANK_DEPOSIT',
      bankName: '',
      accountNumber: '',
      senderCurrency: 'USD',
      receiverCurrency: 'EUR',
    });
    setSummary({
      sendAmount: 1000.00,
      currency: 'USD',
      fee: TRANSFER_FEE,
      exchangeRate: 0.02,
      receiverGets: 920.00,
      receiverCurrency: 'EUR',
      exchangeType: 'BUY',
    });
    setTransferPayload(null);
    setTransactionId(null);
    setApiResponseDoc(null);
    setCurrentStep(Step.DETAILS);
  }, []);

  // Called from ReviewStep → Edit buttons → go back to DETAILS
  const handleEditFromReview = useCallback(() => {
    setCurrentStep(Step.DETAILS);
  }, []);

  // Called from ReviewStep → Confirm & Send → go to PAYMENT
  // const handleConfirm = useCallback(() => {
  //   const txId = `#TRX-${Math.floor(100000 + Math.random() * 900000)}`;
  //   setTransactionId(txId);
  //   setCurrentStep(Step.PAYMENT);
  //   // TODO: trigger your actual payment / API call here
  //   console.log('Confirmed! Proceeding to payment with:', transferPayload);
  // }, [transferPayload]);

  
  

  const handleConfirm = useCallback(async () => {
    if (!transferPayload) return;

    let uploadedFileUrl = null;

    if (transferPayload.docFile) {
      uploadedFileUrl = await uploadFile(transferPayload.docFile, {
        isPrivate: 0,
        doctype: "Currency Exchange For Customer",
      });
    }

    console.log("transfer payload", transferPayload)

    try {
      // Decide which field to use
      let idDocumentField = {};

      if (uploadedFileUrl) {
        if (transferPayload.idType === "PASSPORT") {
          idDocumentField.passport_photo__scan = uploadedFileUrl;
        }

        if (transferPayload.idType === "GOVERNMENT_ID") {
          idDocumentField.government_id_photo__scan = uploadedFileUrl;
        }
      }

      let denominationData = [];

      let receiverData = []

      if (transferPayload.exchangeType === "BUY") {

        denominationData =
          transferPayload.receiverDenominationRows?.map(row => {
            const { denomination_value, denomination_type } = row;
            let itemName = denomination_value;

            if (
              denomination_type === "Note" &&
              transferPayload.notes &&
              transferPayload.notes_name
            ) {
              const index = transferPayload.notes.findIndex(
                n => n === denomination_value
              );
              if (index !== -1) itemName = transferPayload.notes_name[index];
            }

            if (
              denomination_type === "Coin" &&
              transferPayload.coins &&
              transferPayload.coins_name
            ) {
              const index = transferPayload.coins.findIndex(
                c => c === denomination_value
              );
              if (index !== -1) itemName = transferPayload.coins_name[index];
            }

            return {
              denomination: itemName,
              qty: row.count,
              amount: row.subtotal
            };
          }) || [];

        receiverData =
          transferPayload.senderDenominationRows?.map(row => {
            const { denomination_value, denomination_type } = row;
            let itemName = denomination_value;

            if (
              denomination_type === "Note" &&
              transferPayload.sender_notes &&
              transferPayload.sender_notes_name
            ) {
              const index = transferPayload.sender_notes.findIndex(
                n => n === denomination_value
              );
              if (index !== -1) itemName = transferPayload.sender_notes_name[index];
            }

            if (
              denomination_type === "Coin" &&
              transferPayload.sender_coins &&
              transferPayload.sender_coins_name
            ) {
              const index = transferPayload.sender_coins.findIndex(
                c => c === denomination_value
              );
              if (index !== -1) itemName = transferPayload.sender_coins_name[index];
            }

            return {
              denomination: itemName,
              qty: row.count,
              amount: row.subtotal
            };
          }) || [];

      } else {

        denominationData =
          transferPayload.senderDenominationRows?.map(row => {
            const { denomination_value, denomination_type } = row;
            let itemName = denomination_value;

            if (
              denomination_type === "Note" &&
              transferPayload.sender_notes &&
              transferPayload.sender_notes_name
            ) {
              const index = transferPayload.sender_notes.findIndex(
                n => n === denomination_value
              );
              if (index !== -1) itemName = transferPayload.sender_notes_name[index];
            }

            if (
              denomination_type === "Coin" &&
              transferPayload.sender_coins &&
              transferPayload.sender_coins_name
            ) {
              const index = transferPayload.sender_coins.findIndex(
                c => c === denomination_value
              );
              if (index !== -1) itemName = transferPayload.sender_coins_name[index];
            }

            return {
              denomination: itemName,
              qty: row.count,
              amount: row.subtotal
            };
          }) || [];

        receiverData =
          transferPayload.receiverDenominationRows?.map(row => {
            const { denomination_value, denomination_type } = row;
            let itemName = denomination_value;

            if (
              denomination_type === "Note" &&
              transferPayload.notes &&
              transferPayload.notes_name
            ) {
              const index = transferPayload.notes.findIndex(
                n => n === denomination_value
              );
              if (index !== -1) itemName = transferPayload.notes_name[index];
            }

            if (
              denomination_type === "Coin" &&
              transferPayload.coins &&
              transferPayload.coins_name
            ) {
              const index = transferPayload.coins.findIndex(
                c => c === denomination_value
              );
              if (index !== -1) itemName = transferPayload.coins_name[index];
            }

            return {
              denomination: itemName,
              qty: row.count,
              amount: row.subtotal
            };
          }) || [];
      }

      
      const apiPayload = {
        data: {
          verification_id_type: transferPayload.idType,
          passport_number: transferPayload.idNumber,
          first_name: transferPayload.firstName,
          last_name: transferPayload.lastName,
          receiver_mailid: senderInfo.email,
          destination_country: transferPayload.country,
          city__province: transferPayload.city,
          id_number: transferPayload.idNumber,
          government_id: transferPayload.government_id,
          customer_name_and_dob: `${transferPayload.idName}_${transferPayload.dateOfBirth}`,
          full_name: transferPayload.idName,
          date_of_birth: transferPayload.dateOfBirth,
          occupation: transferPayload.occupation,
          second_last_name_family_name: transferPayload.secondLastName,
          id_issue_stateprovince: transferPayload.idIssueState,
          id_issue_country: transferPayload.idIssueCountry,
          ticket: transferPayload.ticket,
          ...idDocumentField,

          you_send: transferPayload.sendAmount,
          you_send_currency_type: transferPayload.senderCurrency,

          they_receive: transferPayload.receiverGets,
          they_receive_currency_type: transferPayload.receiverCurrency,

          expected: transferPayload.sendAmount,
          counted: transferPayload.sendAmount,
          balanced: 0,

          exchange_rate: transferPayload.exchangeRate,
          exchangeType: transferPayload.exchangeType,
          transfer_fee: summary.fee,
          send_amount: transferPayload.sendAmount,
          total_amount: transferPayload.sendAmount + summary.fee,

          denomination: denominationData,

          receiver__gets: receiverData,

          warehouse: selectedWarehouse.warehouse

        },
      };


      const response = await fetch(
        "http://182.71.135.110:82/api/method/moneygram.moneygram.api.create_currency_exchange.create_currency_exchange",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "token 661457e17b8612a:32a5ddcc5a9c177"
          },
          credentials: "include", 
          body: JSON.stringify(apiPayload),
        }
      );

      const result = await response.json();

      console.log("API Success:", result);

      
      const createdDoc = result?.message || result?.data || result;
      setApiResponseDoc(createdDoc);

      
      const txId = createdDoc?.name || `#TRX-${Math.floor(100000 + Math.random() * 900000)}`;
      setTransactionId(txId);

      
      setCurrentStep(Step.PAYMENT);

    } catch (error) {
      console.error("API Error:", error);
      alert("Something went wrong while creating exchange");
    }
  }, [transferPayload, senderInfo.email, summary, transferPayload?.receiverDenominationRows]);

  

  const handleDashboard = useCallback(() => {
    // Reset receiver info
    setReceiverInfo({
      firstName: '',
      lastName: '',
      country: 'Spain',
      city: '',
      deliveryMethod: 'BANK_DEPOSIT',
      bankName: '',
      accountNumber: '',
      senderCurrency: 'USD',
      receiverCurrency: 'EUR',
    });

    // Reset summary
    setSummary({
      sendAmount: 1000.00,
      currency: 'USD',
      fee: TRANSFER_FEE,
      exchangeRate: 0.02,
      receiverGets: 920.00,
      receiverCurrency: 'EUR',
      exchangeType: 'BUY',
    });

    // Clear transfer data
    setTransferPayload(null);
    setTransactionId(null);
    setApiResponseDoc(null);

    // Go back to form step
    setCurrentStep(Step.DETAILS);

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
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      );
    }

    if (currentStep === Step.PAYMENT) {

      return (
        <TransferSuccess
          data={transferPayload}
          apiDoc={apiResponseDoc}
          transactionId={transactionId}
          estimatedArrival="Today by 5:00 PM"
          onDashboard={handleDashboard}
          onDownloadReceipt={handleDownloadReceipt}
        />
      );
    }

  
    return (
      <>
        <SenderCard sender={senderInfo} />

        <ReceiverForm
          initialData={receiverInfo}
          sendAmount={summary.sendAmount}
          onContinue={handleContinue}
          onBack={handleBack}
          onSummaryChange={handleSummaryChange}
          ratesData={ratesData}
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

      <ExchangeProvider summary={summary}>
        <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-7xl mx-auto flex flex-col gap-10">

            <Stepper currentStep={currentStep} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* Main Column — full width on success page */}
              <div className={`${currentStep === Step.PAYMENT ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col gap-10`}>
                {currentStep === Step.DETAILS && (
                  <div className="flex flex-col gap-3">
                    <h1 className="text-gray-900 text-3xl sm:text-5xl font-black tracking-tight leading-none">
                      How much are you exchanging{" "}
                      <span className="text-[#E00000] italic">money ?</span>
                    </h1>
                  </div>
                )}

                {renderStepContent()}
              </div>

              {/* Sidebar — hidden on success page */}
              {currentStep !== Step.PAYMENT && (
                <div className="lg:col-span-4 relative">
                  <Summary />
                </div>
              )}

            </div>
          </div>
        </main>
      </ExchangeProvider>

      <footer className="py-8 px-10 border-t border-gray-100 text-center text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
        © 2026 MoneyGram.
      </footer>
    </div>
  );
};

export default MoneyExchange;