import React, { useContext } from 'react';
import { OrderDetails } from '../types';
import { FileText, CheckCircle } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface CompletionScreenProps {
  orderDetails: OrderDetails;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ orderDetails }) => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
        <div className="w-full max-w-sm mt-8">

            <div className="bg-blue-100 border-l-4 border-primary text-primary-dark p-3 rounded-md text-sm mb-6">
                <p>{t('agreementEmailed')}</p>
            </div>
            
            <div className="text-center">
                <FileText className="text-primary w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">{t('rentalContract')}</h1>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg my-6 text-sm">
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

            <div className="mt-6 bg-blue-100/60 p-4 rounded-lg flex items-start space-x-3">
                <CheckCircle className="text-primary w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                    <h2 className="font-semibold text-primary-dark">{t('contractSignedTitle')}</h2>
                    <p className="text-sm text-gray-700">{t('contractSignedSuccess')}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CompletionScreen;