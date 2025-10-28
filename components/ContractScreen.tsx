import React, { useRef, useState, useContext } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { AppView, OrderDetails } from '../types';
import { ArrowLeft, RefreshCw, FileText, Clipboard, Check } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface ContractScreenProps {
  setView: (view: AppView) => void;
  orderDetails: OrderDetails;
  onContractSign: () => void;
}

const InfoRow: React.FC<{ label: string; value: string; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-500">{label}</span>
        <div className="flex items-center">
          <span className="text-sm text-gray-800 font-medium">{value}</span>
          {children}
        </div>
    </div>
);

const ContractScreen: React.FC<ContractScreenProps> = ({ setView, orderDetails, onContractSign }) => {
  const { t } = useContext(LanguageContext);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setIsSigned(false);
  };

  const handleSign = () => {
    if(!sigCanvas.current?.isEmpty()) {
      setIsSigned(true);
    }
  };
  
  const handleComplete = () => {
      if(agreed && !sigCanvas.current?.isEmpty()) {
        onContractSign();
      } else {
        alert(t('contractAlert'));
      }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => setView(AppView.INSPECTION)} className="mr-4">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold">{t('contractTitle')}</h1>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        
        {/* Booking Info */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-bold text-gray-800 mb-2 flex justify-between items-center">{t('bookingInfoTitle')} <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t('confirmed')}</span></h2>
            <div className="space-y-1">
                <InfoRow label={t('orderNumber')} value={orderDetails.orderNumber}>
                    <button onClick={handleCopy} className="ml-2 text-primary">
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

        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">{t('signatureTitle')}</h2>
              <button onClick={clearSignature} className="flex items-center text-sm text-red-500 font-semibold">
                <RefreshCw size={14} className="mr-1"/> {t('clear')}
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg bg-white">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor='black'
                    canvasProps={{ className: 'w-full h-40 rounded-lg' }}
                    onEnd={handleSign}
                />
            </div>
        </div>

        <div className="flex items-start p-2">
            <input 
                id="agree" 
                type="checkbox" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary mt-1" 
            />
            <label htmlFor="agree" className="ml-3 text-sm text-gray-600">
                <span dangerouslySetInnerHTML={{ __html: t('contractAgreement') }} />
            </label>
        </div>
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0">
          <button 
            onClick={handleComplete} 
            disabled={!agreed || !isSigned}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('signAndComplete')}
          </button>
      </div>
    </div>
  );
};

export default ContractScreen;