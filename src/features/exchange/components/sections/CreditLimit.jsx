import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { getCustomerById } from '../../api/customer';

const CreditLimit = () => {
    const { register, watch, formState: { errors } } = useFormContext();

    const [availableCurrency, setAvailableCurrency] = useState(0.0000);
    const [showUploadModal, setShowUploadModal] = useState(true)

    const idName = watch('idName');
    const dateOfBirth = watch('dateOfBirth');

    const getCustomerDetails = async(idNumber) => {
        const customer = await getCustomerById(idNumber);

        

        setAvailableCurrency(customer.custom_available_currency_transfer_balance)
    }

    useEffect(() => {
      if(idName && dateOfBirth) {
        getCustomerDetails(`${idName}_${dateOfBirth}`)
      }
    }, [idName, dateOfBirth])
    

    return (
        <div>
            {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full mx-4 text-center">
              <div className="text-4xl mb-4">📂</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Exchange Limit exceeded</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                You are  <strong>exceeding </strong> the threshold limit.
              </p>
              <button type="button" onClick={() => setShowUploadModal(false)}
                className="w-full bg-[#E00000] hover:bg-[#B70000] text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
                OK, Got it
              </button>
            </div>
          </div>
        )}
            <div class="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center justify-between" data-purpose="credit-limit-section">
                <div class="flex items-center space-x-4">
                    <div class="bg-red-600 p-3 rounded-full">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Available Transfer Currency Credit Limit</h3>
                        <p class="text-sm text-red-700">Your current limit for this transaction period</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="block text-[10px] uppercase font-bold text-red-400 tracking-widest">Current Balance</span>
                    <span class="text-2xl font-black text-red-900">FJ$ {availableCurrency.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:4})}</span>
                </div>
            </div>
        </div>
    )
}

export default CreditLimit
