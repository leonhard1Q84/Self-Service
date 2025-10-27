import React, { useState, useContext } from 'react';
import { AppView, OrderDetails } from '../types';
import { ArrowLeft, Clipboard, Check } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface ReservationDetailsScreenProps {
  setView: (view: AppView) => void;
  orderDetails: OrderDetails;
}

const InfoRow: React.FC<{ label: string; value: string; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="flex items-center text-right">
          <span className="text-sm text-gray-800 font-medium">{value}</span>
          {children}
        </div>
    </div>
);

const ReservationDetailsScreen: React.FC<ReservationDetailsScreenProps> = ({ setView, orderDetails }) => {
  const { t } = useContext(LanguageContext);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => setView(AppView.OVERVIEW)} className="mr-4">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold">{t('reservationDetailsTitle')}</h1>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        
        {/* Booking Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-bold text-gray-800 mb-2 flex justify-between items-center">{t('bookingInfoTitle')} <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t('confirmed')}</span></h2>
            <div className="space-y-1">
                <InfoRow label={t('orderNumber')} value={orderDetails.orderNumber}>
                    <button onClick={() => handleCopy(orderDetails.orderNumber)} className="ml-2 text-primary p-1 rounded-full hover:bg-gray-100">
                        {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
                    </button>
                </InfoRow>
                <InfoRow label={t('confirmationNumber')} value={orderDetails.confirmationCode} />
                <InfoRow label={t('carModel')} value={orderDetails.vehicle.name} />
                <InfoRow label={t('pickupTime')} value={orderDetails.rentalPeriod.start} />
                <InfoRow label={t('pickupLocation')} value={orderDetails.pickupLocation} />
                <InfoRow label={t('returnTime')} value={orderDetails.rentalPeriod.end} />
                <InfoRow label={t('returnLocation')} value={orderDetails.returnLocation} />
            </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-bold text-gray-800 mb-2">{t('customerInfoTitle')}</h2>
            <div className="space-y-1">
                <InfoRow label={t('mainDriver')} value={orderDetails.customer.name}>
                  <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{t('required')}</span>
                </InfoRow>
                <InfoRow label={t('contactPhone')} value={orderDetails.customer.phone} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsScreen;