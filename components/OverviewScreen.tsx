import React, { useContext, useState } from 'react';
import { AppView, OrderDetails } from '../types';
import { Car, CheckCircle, Circle, ShieldCheck, FileSignature, Search, Languages, Clipboard, Check, Phone, MessageSquare } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface OverviewScreenProps {
  orderDetails: OrderDetails;
  setView: (view: AppView) => void;
  inspectionCompleted: boolean;
}

const StatusIcon: React.FC<{ completed: boolean }> = ({ completed }) => {
    return completed ? <CheckCircle className="text-green-500" size={24}/> : <Circle className="text-gray-300" size={24} />;
};


const LanguageSwitcher: React.FC = () => {
    const { setLang, lang, t } = useContext(LanguageContext);
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh-TW', name: '繁體中文' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'th', name: 'ไทย' },
    ];

    return (
        <div className="relative">
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="appearance-none bg-primary-dark text-white rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none"
            >
                {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <Languages className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
        </div>
    );
}

const OverviewScreen: React.FC<OverviewScreenProps> = ({ orderDetails, setView, inspectionCompleted }) => {
  const { vehicle } = orderDetails;
  const { t } = useContext(LanguageContext);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const steps = [
    { name: t('stepDeposit'), completed: true, action: t('completed'), enabled: false, note: t('stepDepositNote'), icon: ShieldCheck },
    { name: t('stepInspection'), completed: inspectionCompleted, action: inspectionCompleted ? t('completed') : t('stepInspectionAction'), enabled: true, handler: () => setView(AppView.INSPECTION), icon: Search },
    { name: t('stepContract'), completed: false, action: t('stepContractAction'), enabled: inspectionCompleted, handler: () => setView(AppView.CONTRACT), icon: FileSignature }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
        <header className="bg-primary p-4 text-white flex justify-between items-center sticky top-0 z-20">
            <h1 className="text-lg font-bold">{t('pickupTitle')}</h1>
            <LanguageSwitcher />
        </header>

      <main className="p-4 space-y-4 pb-20">

        <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
            <div className="flex items-center space-x-2 truncate">
                 <span className="text-gray-500 text-sm">{t('confirmationNumberLabel')}</span>
                 <button onClick={() => setView(AppView.RESERVATION_DETAILS)} className="font-bold text-primary hover:underline truncate">
                    # {orderDetails.confirmationCode}
                </button>
            </div>
            <button onClick={handleCopy} className="text-primary flex-shrink-0 ml-2 p-1.5 rounded-full hover:bg-gray-100">
                {copied ? <Check size={18} className="text-green-500" /> : <Clipboard size={18} />}
            </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 px-2">{t('carReadyTitle')}</h2>

        {/* Vehicle Info Card */}
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
                <img src={vehicle.image} alt={vehicle.name} className="w-28 h-auto object-contain" />
                <h3 className="text-xl font-bold text-gray-900 flex-1">{vehicle.name}</h3>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-gray-500 uppercase text-xs font-semibold">{t('licensePlate')}</p>
                    <p className="font-medium">{vehicle.state} ▸ {vehicle.licensePlate}</p>
                </div>
                <div>
                    <p className="text-gray-500 uppercase text-xs font-semibold">{t('color')}</p>
                    <p className="font-medium">{vehicle.color}</p>
                </div>
            </div>
        </div>
        
        {/* Pickup Location */}
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-3">{t('pickupLocationTitle')}</h3>
            <div className="space-y-1 mb-4">
                <p className="font-semibold text-gray-800">{orderDetails.pickupLocationDetails.name}</p>
                <p className="text-sm text-gray-600">{orderDetails.pickupLocation}</p>
            </div>
            <div className="pt-4 border-t grid grid-cols-2 gap-2">
                <a href={`tel:${orderDetails.pickupLocationDetails.phone}`} className="flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    <Phone size={16} />
                    <span className="text-sm font-semibold">{t('call')}</span>
                </a>
                <a href={`https://wa.me/${orderDetails.pickupLocationDetails.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    <MessageSquare size={16} />
                    <span className="text-sm font-semibold">{t('message')}</span>
                </a>
            </div>
        </div>


        {/* Pickup Instructions */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-3">{t('pickupInstructions')}</h3>
          <div className="space-y-4">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                        <step.icon className={`mt-1 ${step.completed ? 'text-primary' : step.enabled ? 'text-gray-600' : 'text-gray-400'}`} size={24} />
                        <div>
                            <p className={`font-semibold ${!step.enabled && !step.completed ? 'text-gray-400' : 'text-gray-800'}`}>{step.name}</p>
                            {step.note && <p className="text-xs text-gray-500">{step.note}</p>}
                        </div>
                    </div>
                    <button 
                        onClick={step.handler} 
                        disabled={!step.enabled}
                        className={`text-sm font-semibold py-1.5 px-4 rounded-md transition-colors ${
                            step.completed 
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : step.enabled 
                            ? 'bg-primary text-white hover:bg-primary-dark' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {step.action}
                    </button>
                </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default OverviewScreen;