
import React, { useContext } from 'react';
import { OrderDetails, AppView } from '../types';
import { FileText, CheckCircle, Car, AlertTriangle, Download } from 'lucide-react';
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
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        <div className="flex-grow p-6 flex flex-col items-center justify-center overflow-y-auto">
            <div className="w-full max-w-sm text-center space-y-6">
                
                <div className="animate-scale-in">
                    <div className="mx-auto bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="text-green-600 w-12 h-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('contractSignedTitle')}</h1>
                    <p className="text-gray-500 mt-2">{t('contractSignedSuccess')}</p>
                </div>

                {/* Contract Card */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-left">
                    <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                        <FileText className="text-primary w-6 h-6 mr-3" />
                        <div>
                             <h2 className="font-bold text-gray-800">{t('rentalContract')}</h2>
                             <p className="text-xs text-gray-400">{t('agreementEmailed')}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('contractNumber')}</span>
                            <span className="font-medium">{orderDetails.contract.number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">{t('signingDate')}</span>
                            <span className="font-medium">{orderDetails.contract.date}</span>
                        </div>
                    </div>

                    <button 
                        className="w-full mt-5 bg-gray-50 text-primary font-bold py-3 px-4 rounded-xl border border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center justify-center text-sm"
                    >
                        <Download size={16} className="mr-2" />
                        {t('downloadContractCopy')}
                    </button>
                </div>

                {/* Warning Alert */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start text-left">
                     <AlertTriangle className="text-orange-500 w-5 h-5 flex-shrink-0 mr-3 mt-0.5" />
                     <p className="text-xs text-orange-800 leading-relaxed font-medium">
                        {t('dataMismatchWarning')}
                     </p>
                </div>

            </div>
        </div>
        
        {/* Footer Action */}
        <div className="p-4 bg-white border-t sticky bottom-0">
            <button 
                onClick={handleStart}
                className="w-full bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center shadow-lg"
            >
                <Car size={20} className="mr-2" />
                {t('backToOverview')}
            </button>
        </div>
    </div>
  );
};

export default CompletionScreen;
