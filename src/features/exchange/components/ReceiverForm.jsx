import React, { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useExchange } from '../../../context/ExchangeContext';

import { useBaseCurrency, useDenomination } from '../../../hooks/useDenomination';
import { useERPFileUpload } from '../../../hooks/useERPFileUpload';
import { useExchangeCalculation } from '../hooks/useExchangeCalculation';

import { GovernmentIdSection } from './sections/GovernmentIdSection';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { LocationSection } from './sections/LocationSection';
import { ExchangeSection } from './sections/ExchangeSection';
import { DenominationSection } from './sections/DenominationSection';
import { SectionDivider } from './ui/FormUtilities';
import CreditLimit from './sections/CreditLimit';

export const ReceiverForm = ({
  initialData,
  sendAmount: externalSendAmount,
  onContinue,
  onBack,
  onSummaryChange,
  ratesData,
}) => {
  const methods = useForm({
    defaultValues: {
      country: initialData?.country ?? 'India',
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      city: initialData?.city ?? '',
      idType: 'PASSPORT',
      idNumber: '',
      docFile: null,
      ticketFile: null,
      pastReceiver: 'New Receiver',
      exchangeType: 'BUY',
      government_id: 'Passport'
    },
  });

  const { handleSubmit, setFocus } = methods;
  const { receiverGets } = useExchange();
  const { uploadFile, loading: uploadLoading } = useERPFileUpload();

  const {
    availableCurrencies,
    loading: ratesLoading,
    error: rateError,
    rateDate,
    noDataForToday,
    showUploadModal,
    setShowUploadModal,
  } = ratesData || {};

  const exchangeType = methods.watch('exchangeType');

  const {
    toCurrency,
    setToCurrency,
    manualRate,
    useManualRate,
    setManualRate,
    sendAmount,
    setSendAmount,
    sendAmountError,
    setSendAmountError,
    effectiveRate,
    exchangePreview,
  } = useExchangeCalculation({
    availableCurrencies,
    externalSendAmount,
    noDataForToday,
    onSummaryChange,
    exchangeType,
  });

  const { data: baseCurrencyInfo } = useBaseCurrency();
  const selectedDenomCountry = toCurrency?.country ?? null;
  const { data: foreignCurrencyInfo, loading: denomLoading, error: denomError } = useDenomination(selectedDenomCountry);

  const senderInfo = exchangeType === 'BUY' ? baseCurrencyInfo : foreignCurrencyInfo;
  const receiverInfo = exchangeType === 'BUY' ? foreignCurrencyInfo : baseCurrencyInfo;

  const senderDenomRowsRef = useRef([]);
  const receiverDenomRowsRef = useRef([]);

  const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date); // ✅ convert
    if (isNaN(d)) return null; // safety check

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${y}-${m}-${day}`;
  };

  const onSubmit = async (data) => {

    if (!sendAmount || sendAmount <= 0) {
      setSendAmountError('Please enter a valid send amount');
      return;
    }
    if (!effectiveRate || effectiveRate <= 0) return;
    if (useManualRate && (!manualRate || parseFloat(manualRate) <= 0)) return;
    setSendAmountError('');

    const getDenomType = (denom, notesArr = [], coinsArr = []) => {
      if (notesArr.includes(denom)) return 'Note';
      if (coinsArr.includes(denom)) return 'Coin';
      return denom >= 1 ? 'Note' : 'Coin';
    };

    let ticketUrl = null;
    if (data.ticketFile) {
      ticketUrl = await uploadFile(data.ticketFile);

      console.log("ticketUrl", ticketUrl);
      if (!ticketUrl) {
        // If upload fails, error is likely handled via hook state, but we should stop submission
        setSendAmountError('Failed to upload ticket document. Please try again.');
        return;
      }
    }

    onContinue?.({
      ...data,
      dateOfBirth: data.dateOfBirth ? formatDate(data.dateOfBirth) : null,
      sender_notes: senderInfo?.notes ?? [],
      sender_notes_name: senderInfo?.notes_name ?? [],
      sender_coins: senderInfo?.coins ?? [],
      sender_coins_name: senderInfo?.coins_name ?? [],
      notes: receiverInfo?.notes ?? [],
      notes_name: receiverInfo?.notes_name ?? [],
      coins: receiverInfo?.coins ?? [],
      coins_name: receiverInfo?.coins_name ?? [],
      sendAmount,
      senderCurrency: toCurrency?.code,
      receiverCurrency: toCurrency?.code ?? '',
      exchangeRate: exchangePreview?.rate ?? 0,
      receiverGets: exchangePreview?.rawAmount ?? 0,
      rateSource: useManualRate ? 'manual' : 'erpnext',
      rateDate: useManualRate ? null : rateDate,
      ticket: ticketUrl,
      senderDenominationRows: senderDenomRowsRef.current.filter(r => r.count > 0).map(r => ({
        denomination_value: r.denom,
        denomination_type: getDenomType(r.denom, senderInfo?.notes, senderInfo?.coins),
        count: r.count,
        subtotal: r.denom * r.count,
      })),
      receiverDenominationRows: receiverDenomRowsRef.current.filter(r => r.count > 0).map(r => ({
        denomination_value: r.denom,
        denomination_type: getDenomType(r.denom, receiverInfo?.notes, receiverInfo?.coins),
        count: r.count,
        subtotal: r.denom * r.count,
      })),
    });
  };

  // Ordered list of fields: text-focusable ones use setFocus, file ones use element id scroll
  const FIELD_ORDER = [
    'idName', 'dateOfBirth', 'government_id', 'idNumber',
    'idIssueCountry', 'idIssueState', 'docFile', 'ticketFile',
    'firstName', 'lastName', 'city', 'country', 'exchangeType',
  ];
  const FILE_FIELDS = new Set(['docFile', 'ticketFile']);

  const onError = (errors) => {
    const firstErrorField = FIELD_ORDER.find(f => errors[f]);
    if (!firstErrorField) return;
    if (FILE_FIELDS.has(firstErrorField)) {
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      try { setFocus(firstErrorField); } catch (_) { }
      const el = document.getElementById(`field-${firstErrorField}`) ||
        document.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const FJD = { code: 'FJD', symbol: 'FJ$', name: 'Fijian Dollar' };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full mx-4 text-center">
              <div className="text-4xl mb-4">📂</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">No Exchange Rates Found</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Please contact admin to update the rates.
              </p>
              <button type="button" onClick={() => setShowUploadModal(false)}
                className="w-full bg-[#E00000] hover:bg-[#B70000] text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
                OK, Got it
              </button>
            </div>
          </div>
        )}



        <div className="bg-[#B70000] px-6 sm:px-10 py-7">
          <div className="max-w-5xl mx-auto flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <UserPlus size={18} className="text-white" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-white font-semibold text-xl">Customer Details</h1>
                <p className="text-[#b5f000] text-sm mt-0.5">Currency Exchange Transaction</p>
              </div>
            </div>

            {toCurrency && effectiveRate && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2 rounded-lg">
                  <span className="text-[#b5f000] text-xs">Live Rate</span>
                  <span className="text-white text-sm font-semibold">
                    1 {toCurrency.code} = {FJD.symbol}{effectiveRate} {FJD.code}
                  </span>
                </div>
                <span className="text-xs font-medium bg-white/10 border border-white/20 text-yellow-200 px-2.5 py-1.5 rounded-lg uppercase tracking-wide">
                  {exchangeType === 'BUY' ? '🟢 Buying' : '🔴 Selling'}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="px-4 sm:px-8 lg:px-12 py-8 flex flex-col gap-5 max-w-5xl mx-auto" noValidate>
          {(!effectiveRate || effectiveRate <= 0) && !ratesLoading && (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-[#E00000]/20 bg-[#E00000]/5">
              <AlertCircle size={15} className="text-[#E00000] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-red-800">Exchange Rates Unavailable</p>
                <p className="text-xs text-[#E00000] mt-0.5">
                  No rates found for today. Please contact admin to update the rates.
                </p>
              </div>
            </div>
          )}

          {effectiveRate > 0 && !ratesLoading && !noDataForToday && rateDate && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3.5 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-sm">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
              Today's exchange rate is available (Date: {rateDate}).
            </div>
          )}

          <CreditLimit />
          <GovernmentIdSection exchangeType={exchangeType} />

          <SectionDivider label="Personal Information" />
          <PersonalInfoSection />
          <LocationSection />

          <SectionDivider label="Exchange Details" />
          <ExchangeSection
            exchangeType={exchangeType}
            availableCurrencies={availableCurrencies}
            ratesLoading={ratesLoading}
            rateError={rateError}
            toCurrency={toCurrency}
            setToCurrency={setToCurrency}
            useManualRate={useManualRate}
            setManualRate={setManualRate}
            sendAmount={sendAmount}
            setSendAmount={setSendAmount}
            sendAmountError={sendAmountError}
            setSendAmountError={setSendAmountError}
            effectiveRate={effectiveRate}
            exchangePreview={exchangePreview}
          />

          <SectionDivider label="Cash Denomination Counts" />
          <DenominationSection
            senderInfo={senderInfo}
            receiverInfo={receiverInfo}
            exchangeType={exchangeType}
            sendAmount={sendAmount}
            receiverGets={receiverGets}
            denomLoading={denomLoading}
            denomError={denomError}
            selectedDenomCountry={selectedDenomCountry}
            senderDenomRowsRef={senderDenomRowsRef}
            receiverDenomRowsRef={receiverDenomRowsRef}
          />



          <div className="flex items-center justify-between pt-2 pb-8">
            <button type="button" onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors px-4 py-2.5 rounded-lg hover:bg-gray-100">
              ← Back
            </button>

            <button type="submit"
              disabled={!effectiveRate || effectiveRate <= 0 || ratesLoading || uploadLoading}
              className="flex items-center gap-2 bg-[#E00000] hover:bg-[#B70000] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold h-11 px-8 rounded-xl transition-colors group">
              {uploadLoading ? 'Uploading...' : 'Continue'}
              {!uploadLoading && <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
