
import React, { useContext } from 'react';
import { OrderDetails, AppView } from '../types';
import { FileText, CheckCircle, Car } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface CompletionScreenProps {
  orderDetails: OrderDetails;
  setView: (view: AppView) => void;
  onStartRental?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ orderDetails, setView, onStartRental }) => {
  const { t } = useContext(LanguageContext);

  const handleStart = () => {
      if (onStartRental) {
          onStartRental();
      } else {
          setView(AppView.OVERVIEW);
      }
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
        <div className="w-full max-w-sm mt-8 text-center">
            
            <div className="text-center">
                <FileText className="text-primary w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">{t('rentalContract')}</h1>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg my-6 text-sm text-left">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('contractNumber')}</span>
                    <span className="font-semibold text-gray-800">{orderDetails.contract.number}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">{t('signingDate')}</span>
                    <span className="font-semibold text-gray-800">{orderDetails.contract.date}</span>
                </div>
            </div>
            
            <button 
                className="w-full bg-white text-primary font-bold py-3 px-4 rounded-lg border-2 border-primary hover:bg-blue-50 transition-colors"
            >
                {t('downloadContractCopy')}
            </button>

            <div className="mt-6 bg-blue-100/60 p-4 rounded-lg flex items-start space-x-3 text-left">
                <CheckCircle className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                    <h2 className="font-semibold text-primary-dark">{t('contractSignedTitle')}</h2>
                    <p className="text-sm text-gray-700">{t('contractSignedSuccess')}</p>
                </div>
            </div>

            <button 
                onClick={handleStart}
                className="w-full bg-primary text-white font-bold py-4 px-4 rounded-xl mt-8 hover:bg-primary-dark transition-colors flex items-center justify-center shadow-lg"
            >
                <Car size={20} className="mr-2" />
                {t('backToOverview')}
            </button>
        </div>
    </div>
  );
};

export default CompletionScreen;
