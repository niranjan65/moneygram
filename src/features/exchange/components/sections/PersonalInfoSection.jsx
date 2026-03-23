import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDown, FileText, UserPlus } from 'lucide-react';
import { FieldLabel, fieldCls, ErrorMsg } from '../ui/FormUtilities';
import { personalInfoFields } from '../../config/formFields';

export const PersonalInfoSection = () => {
  const { register, formState: { errors } } = useFormContext();

  const occupations = [
  'Accountant / Auditor',
  'Agriculture / Farming',
  'Business Owner / Entrepreneur',
  'Civil Servant / Government Employee',
  'Construction / Trades Worker',
  'Doctor / Medical Professional',
  'Driver / Transport Worker',
  'Engineer',
  'Fisherman',
  'Hospitality / Tourism',
  'Housewife / Homemaker',
  'IT / Technology',
  'Lawyer / Legal Professional',
  'Military / Police / Security',
  'Mining / Resource Worker',
  'NGO / Non-Profit Worker',
  'Nurse / Healthcare Worker',
  'Pensioner / Retired',
  'Sales / Marketing',
  'Student',
  'Teacher / Educator',
  'Unemployed',
  'Other',
];

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
        <UserPlus size={15} className="text-[#E00000]" />
        <div>
          <p className="text-sm font-semibold text-gray-800">Customer Name</p>
          <p className="text-xs text-gray-400">Enter the customer's legal name as on ID</p>
        </div>
      </div>
      <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalInfoFields.map(({ name, label, placeholder, rules }) => (
          <div key={name}>
            <FieldLabel required>{label}</FieldLabel>
            <input 
              type="text" 
              placeholder={placeholder} 
              {...register(name, rules)} 
              className={fieldCls(errors[name])} 
            />
            <ErrorMsg message={errors[name]?.message} />
          </div>
        ))}
        <div>
          <FieldLabel icon={FileText}>Occupation</FieldLabel>
          <div className="relative mt-1">
            <select className={`${fieldCls(errors.occupation)} appearance-none pr-10`}
              {...register('occupation')}>
              
              {
                occupations.map((occup, idx) => (
                  <option key={idx}>{occup}</option>
                ))
              }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
