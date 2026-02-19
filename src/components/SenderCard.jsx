
import React from 'react';
import { User, Mail, Phone, Edit3 } from 'lucide-react';



export const SenderCard = ({ sender }) => {
  return (
    // Fixed: changed 'class' to 'className' throughout the component
    <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
        <h3 className="text-gray-900 dark:text-white font-extrabold text-base flex items-center gap-2">
          <User size={18} className="text-primary" />
          Sender Information
        </h3>
        <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 uppercase tracking-wider">
          <Edit3 size={14} />
          Edit
        </button>
      </div>
      <div className="px-6 py-5 flex flex-wrap gap-x-12 gap-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{sender.name}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{sender.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{sender.phone}</span>
        </div>
      </div>
    </div>
  );
};
