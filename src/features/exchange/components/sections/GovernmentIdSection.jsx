import React, { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ChevronDown, BadgeCheck, Upload, FileText, CheckCircle2, ShieldCheck, X, Calendar } from 'lucide-react';
import { FieldLabel, fieldCls, ErrorMsg } from '../ui/FormUtilities';
import { useCustomer } from '../../hooks/useCustomer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const GovernmentIdSection = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const [dragOver, setDragOver] = useState(false);
  const governmentId = watch('government_id');
  const idName = watch('idName');
  const dateOfBirth = watch('dateOfBirth');

  const {
    previewUrl,
    previewFile,
    fetchAndFillCustomer,
    clearCustomerData,
    removeFile,
    handleFile
  } = useCustomer();

  // useEffect(() => {
  //   if (!governmentId) return;
  //   clearCustomerData();
  // }, [governmentId, clearCustomerData]);

  register('docFile', { validate: v => !!v || 'Please upload a government document' });

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const formatDate = (date) => {
    if (!date) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const triggerFetchIfReady = (name, dob) => {
    if (!name || !dob) return;
    const formatted = formatDate(dob);
    fetchAndFillCustomer(`${name}_${formatted}`);
  };

  const placeholders = {
    'Passport': 'e.g. A12345678',
    'Government ID': 'e.g. 987654321',
    'Driver\'s Licence': 'e.g. DL12345678',
    'Voter ID Card': 'e.g. V12345678',
    'TIN Card': 'e.g. 785865000'
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
        <ShieldCheck size={16} className="text-[#E00000] flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-800">ID Verification</p>
          <p className="text-xs text-gray-400">Required for compliance — data is encrypted and secure</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold text-[#E00000] bg-[#E00000]/5 border border-[#E00000]/10 px-2 py-0.5 rounded">
          ID Check
        </span>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        <div>
          <FieldLabel required icon={FileText}>Full Name (Exact name on the id)</FieldLabel>
          <input type="text" placeholder="Enter your full name"
            {...register('idName', {
              required: 'Full Name is required',
              minLength: { value: 3, message: 'Name is too short' },
              onBlur: (e) => { triggerFetchIfReady(e.target.value, dateOfBirth); },
            })}
            className={`${fieldCls(errors.idName)} mt-1`} />
          <ErrorMsg message={errors.idName?.message} />
        </div>



        <div>
          <FieldLabel required icon={Calendar}>Date of Birth</FieldLabel>
          <Controller
            name="dateOfBirth"
            rules={{
              required: 'Date of birth is required',
              validate: (v) => {
                if (!v) return 'Date of birth is required';
                const today = new Date();
                const dob = new Date(v);
                if (dob >= today) return 'Date of birth must be in the past';

                return true;
              },
            }}
            render={({ field }) => (
              <div className="dob-picker-wrapper mt-1">
                <DatePicker
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    triggerFetchIfReady(idName, date);
                  }}
                  onBlur={field.onBlur}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  className={fieldCls(errors.dateOfBirth)}
                  wrapperClassName="block w-full"
                  autoComplete="off"
                />
              </div>
            )}
          />
          <ErrorMsg message={errors.dateOfBirth?.message} />
        </div>

        <div>
          <FieldLabel icon={FileText}>ID Type</FieldLabel>
          <div className="relative mt-1">
            <select className={`${fieldCls(errors.government_id)} appearance-none pr-10`}
              {...register('government_id')}>
              <option>Driver's Licence</option>
              <option>Voter ID Card</option>
              <option>Passport</option>
              <option>TIN Card</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div>
          <FieldLabel required icon={BadgeCheck}>ID Number</FieldLabel>
          <input type="text" placeholder={placeholders[governmentId] || 'e.g. 123456789'}
            {...register('idNumber', {
              required: 'ID number is required',
              minLength: { value: 3, message: 'ID number is too short' },
              // onBlur: (e) => { fetchAndFillCustomer(e.target.value); },
            })}
            className={`${fieldCls(errors.idNumber)} mt-1`} />
          <ErrorMsg message={errors.idNumber?.message} />
        </div>

        <div>
          <FieldLabel required icon={BadgeCheck}>ID Issue Country</FieldLabel>
          <input type="text" placeholder={'Fiji - Fiji'}
            {...register('idIssueCountry', {
              required: 'ID Issue Country is required',
              minLength: { value: 3, message: 'ID Isuue Country is too short' },
              
            })}
            className={`${fieldCls(errors.idIssueCountry)} mt-1`} />
          <ErrorMsg message={errors.idIssueCountry?.message} />
        </div>

        <div>
          <FieldLabel icon={BadgeCheck}>ID Issue State/Province</FieldLabel>
          <input type="text" 
            {...register('idIssueState', {
              
              minLength: { value: 3, message: 'ID Isuue Country is too short' },
              
            })}
            className={`${fieldCls(errors.idIssueCountry)} mt-1`} />
          <ErrorMsg message={errors.idIssueCountry?.message} />
        </div>

        <div>
          <FieldLabel required icon={Upload}>
            {governmentId === 'Passport' ? 'Passport Photo / Scan' : 'Government ID Photo / Scan'}
          </FieldLabel>
          <div className="mt-1">
            {previewUrl ? (
              <div className={`rounded-lg border overflow-hidden ${errors.docFile ? 'border-[#E00000]/30' : 'border-gray-200'}`}>
                {previewFile?.type === 'application/pdf' ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-white">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#E00000]/5">
                      <FileText size={16} className="text-[#E00000]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{previewFile.name}</p>
                      <p className="text-xs text-gray-400">{(previewFile.size / 1024).toFixed(1)} KB · PDF</p>
                    </div>
                    <button type="button" onClick={removeFile}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#E00000] hover:bg-[#E00000]/5 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={previewUrl} alt="ID" className="w-full max-h-48 object-contain p-3 bg-gray-50" />
                    <button type="button" onClick={removeFile}
                      className="absolute top-2 right-2 w-7 h-7 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-gray-400 hover:text-[#E00000] transition-colors">
                      <X size={13} />
                    </button>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 border-t border-green-100 text-xs font-medium text-green-700">
                      <CheckCircle2 size={11} strokeWidth={2.5} /> Document uploaded
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <label
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center gap-3 py-8 px-5 rounded-lg border-2 border-dashed cursor-pointer transition-all ${dragOver
                    ? 'border-[#E00000] bg-[#E00000]/5'
                    : errors.docFile
                      ? 'border-[#E00000]/30 bg-[#E00000]/5/50'
                      : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="hidden" onChange={e => handleFile(e.target.files[0])} />
                <Upload size={20} className={dragOver ? 'text-[#E00000]' : errors.docFile ? 'text-[#E00000]' : 'text-gray-300'} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Drop here or <span className="text-[#E00000] underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP or PDF · Max 10 MB</p>
                </div>
              </label>
            )}
          </div>
          <ErrorMsg message={errors.docFile?.message} />
        </div>
      </div>
    </div>
  );
};
