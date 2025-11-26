
import React, { useContext, useState } from 'react';
import { AppView, OrderDetails } from '../types';
import { Car, CheckCircle, Circle, ShieldCheck, FileSignature, Search, Languages, Clipboard, Check, Phone, MessageSquare, MapPin, Gauge, Fuel, Navigation, Lightbulb, Volume2, Lock, Unlock, FileText, ChevronRight } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface OverviewScreenProps {
  orderDetails: OrderDetails;
  setView: (view: AppView) => void;
  inspectionCompleted: boolean;
  contractSigned: boolean;
}

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

const OverviewScreen: React.FC<OverviewScreenProps> = ({ orderDetails, setView, inspectionCompleted, contractSigned }) => {
  const { vehicle } = orderDetails;
  const { t } = useContext(LanguageContext);
  const [copied, setCopied] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(vehicle.isLocked);

  const isRentalActive = orderDetails.isRentalActive;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(orderDetails.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = (action: string) => {
    setActiveAction(action);
    if (action === 'toggleLock') {
        setTimeout(() => {
            setIsLocked(!isLocked);
            setActiveAction(null);
        }, 1000);
    } else {
        setTimeout(() => setActiveAction(null), 2000);
    }
  };
  
  // Define Steps Flow
  const steps = [
    { 
        name: t('stepDeposit'), 
        completed: orderDetails.isDepositPaid, 
        action: orderDetails.isDepositPaid ? t('view') : t('stepDepositAction'), 
        enabled: !orderDetails.isDepositPaid || isRentalActive, // Always enabled if active (to view)
        handler: () => setView(AppView.DEPOSIT), 
        note: orderDetails.isDepositPaid ? t('statusCaptured') : t('stepDepositNote'), 
        icon: ShieldCheck,
        hiddenInActive: false
    },
    { 
        name: t('stepInspection'), 
        completed: inspectionCompleted, 
        action: inspectionCompleted ? t('view') : t('stepInspectionAction'), 
        enabled: (orderDetails.isDepositPaid && !inspectionCompleted) || inspectionCompleted, 
        handler: () => setView(AppView.INSPECTION), 
        icon: Search,
        hiddenInActive: false 
    },
    { 
        name: t('stepContract'), 
        completed: contractSigned, 
        action: contractSigned ? t('view') : t('stepContractAction'), 
        enabled: (orderDetails.isDepositPaid && inspectionCompleted) || contractSigned, 
        handler: () => setView(AppView.CONTRACT), 
        icon: FileSignature,
        hiddenInActive: false
    }
  ];

  // If rental is active, we add "Return Vehicle" as the next big step
  if (isRentalActive) {
      steps.push({
          name: t('stepReturn'),
          completed: false,
          action: t('stepReturnAction'),
          enabled: true,
          handler: () => { /* Future Return Flow */ },
          note: t('stepReturnNote') + orderDetails.rentalPeriod.end.split(' ')[0],
          icon: CheckCircle,
          hiddenInActive: false
      });
  }

  // Active Rental Dashboard Widget
  const ActiveRentalDashboard = () => (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fade-in">
           {/* Map Header */}
           <div className="relative h-48 w-full bg-gray-200">
                 <div className="absolute inset-0 bg-cover bg-center opacity-90" style={{ backgroundImage: "url('https://i.ibb.co/C0h0q4X/mock-map.png')" }}></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-white px-3 py-1.5 rounded-full shadow-lg flex items-center animate-pulse">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm font-bold">{t('currentLocation')}</span>
                    </div>
                </div>
                 {/* Car Overlay */}
                 <div className="absolute bottom-[-20px] left-4 border-4 border-white rounded-xl shadow-md bg-white">
                      <img src={vehicle.image} alt={vehicle.name} className="w-20 h-14 object-contain p-1" />
                 </div>
            </div>

            {/* Stats & Controls */}
            <div className="pt-8 px-5 pb-5">
                 <div className="flex justify-between items-start mb-4">
                     <div>
                        <h2 className="text-xl font-bold text-gray-900">{vehicle.name}</h2>
                        <p className="text-gray-500 text-sm">{vehicle.licensePlate}</p>
                    </div>
                     <div className="flex space-x-4 text-center">
                        <div>
                             <p className="text-lg font-bold text-gray-800 flex items-center justify-center"><Fuel size={14} className="mr-1 text-blue-500"/> {vehicle.fuelLevel}%</p>
                        </div>
                         <div>
                             <p className="text-lg font-bold text-gray-800 flex items-center justify-center"><Gauge size={14} className="mr-1 text-green-500"/> {vehicle.range} <span className="text-xs font-normal ml-0.5">{t('km')}</span></p>
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3">
                         <button onClick={() => handleAction('flash')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition">
                            <Lightbulb size={24} className="text-orange-500 mb-1" />
                            <span className="text-[10px] font-medium text-gray-700">{t('actionFlash')}</span>
                        </button>
                        <button onClick={() => handleAction('honk')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition">
                            <Volume2 size={24} className="text-blue-500 mb-1" />
                            <span className="text-[10px] font-medium text-gray-700">{t('actionHonk')}</span>
                        </button>
                         <button 
                            onClick={() => handleAction('toggleLock')} 
                            className={`flex flex-col items-center justify-center p-3 rounded-xl active:scale-95 transition ${isLocked ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'}`}
                        >
                            {isLocked ? (
                                <>
                                    <Unlock size={24} className="text-green-600 mb-1" />
                                    <span className="text-[10px] font-medium text-gray-700">{t('actionUnlock')}</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={24} className="text-red-500 mb-1" />
                                    <span className="text-[10px] font-medium text-gray-700">{t('actionLock')}</span>
                                </>
                            )}
                        </button>
                </div>
                {activeAction && (
                    <div className="mt-3 flex items-center justify-center text-green-600 text-sm bg-green-50 py-1 rounded-lg animate-fade-in">
                        <CheckCircle size={14} className="mr-1.5" />
                        <span>
                            {activeAction === 'toggleLock' 
                                ? (isLocked ? t('actionUnlockSent') : t('actionLockSent')) 
                                : t('actionSent')
                            }
                        </span>
                    </div>
                )}
            </div>
      </div>
  );

  // Pre-Pickup Hero Widget
  const PrePickupHero = () => (
    <div 
        className="bg-white p-4 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group mb-6"
        onClick={() => setView(AppView.VEHICLE_STATUS)}
    >
        <div className="flex items-center space-x-4">
            <img src={vehicle.image} alt={vehicle.name} className="w-28 h-auto object-contain" />
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <div className="flex items-center text-sm text-primary font-semibold mt-1">
                    <MapPin size={14} className="mr-1" />
                    {t('parkingSpot')}: {vehicle.parkingSpot || 'A-23'}
                </div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
            <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold">{t('licensePlate')}</p>
                <p className="font-medium">{vehicle.state} {vehicle.licensePlate}</p>
            </div>
            <div>
                <p className="text-gray-500 uppercase text-[10px] font-bold">{t('color')}</p>
                <p className="font-medium">{vehicle.color}</p>
            </div>
        </div>
        
        <div className="mt-4 bg-blue-50 rounded-lg p-2.5 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
            <Navigation size={16} className="mr-2" />
            {t('findCar')}
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
        <header className="bg-primary p-4 text-white flex justify-between items-center sticky top-0 z-20 shadow-md">
            <h1 className="text-lg font-bold">{isRentalActive ? t('myRentalTitle') : t('pickupTitle')}</h1>
            <LanguageSwitcher />
        </header>

      <main className="p-4 relative z-10">
        
        {/* Order Ref Strip */}
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex justify-between items-center mb-4 text-sm">
             <div className="flex items-center space-x-1 truncate">
                 <span className="text-gray-500">{t('confirmationNumberLabel')}</span>
                 <button onClick={() => setView(AppView.RESERVATION_DETAILS)} className="font-bold text-primary hover:underline">
                    {orderDetails.confirmationCode}
                </button>
            </div>
            <button onClick={handleCopy} className="text-gray-400 hover:text-primary transition-colors">
                {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
            </button>
        </div>
        
        {/* Dynamic Hero Section */}
        <h2 className="text-xl font-bold text-gray-800 mb-3 px-1">{isRentalActive ? t('carActiveTitle') : t('carReadyTitle')}</h2>
        {isRentalActive ? <ActiveRentalDashboard /> : <PrePickupHero />}
        
        {/* Journey Timeline */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            {t('pickupInstructions')}
          </h3>
          <div className="space-y-0 relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-200"></div>

            {steps.map((step, index) => {
                const isClickable = step.completed || step.enabled;
                const isCurrent = step.enabled && !step.completed;
                
                return (
                    <div 
                        key={index} 
                        className={`relative pl-12 pb-6 last:pb-0 ${isClickable ? 'cursor-pointer group' : 'opacity-60'}`}
                        onClick={(e) => { 
                            if(isClickable) {
                                e.stopPropagation(); 
                                step.handler(); 
                            }
                        }}
                    >
                        {/* Status Icon */}
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-colors ${
                            step.completed ? 'bg-green-100 border-white text-green-600' : 
                            isCurrent ? 'bg-primary border-white text-white shadow-md' : 'bg-gray-100 border-white text-gray-400'
                        }`}>
                            {step.completed ? <Check size={20} /> : <step.icon size={18} />}
                        </div>

                        {/* Content */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-bold text-sm ${step.completed ? 'text-gray-800' : isCurrent ? 'text-primary' : 'text-gray-500'}`}>
                                    {step.name}
                                </p>
                                {step.note && <p className="text-xs text-gray-500 mt-0.5">{step.note}</p>}
                            </div>
                            
                            {isClickable && (
                                <button className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                                    step.completed 
                                    ? 'bg-gray-50 text-gray-600 border border-gray-200 group-hover:bg-gray-100' 
                                    : 'bg-primary text-white hover:bg-primary-dark shadow-sm'
                                }`}>
                                    {step.action}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-white p-4 rounded-xl shadow-lg mt-6">
            <h3 className="text-lg font-bold mb-3">{t('pickupLocationTitle')}</h3>
            <div className="space-y-1 mb-4">
                <p className="font-semibold text-gray-800">{orderDetails.pickupLocationDetails.name}</p>
                <p className="text-sm text-gray-600">{orderDetails.pickupLocation}</p>
            </div>
            <div className="pt-4 border-t grid grid-cols-2 gap-3">
                <a href={`tel:${orderDetails.pickupLocationDetails.phone}`} className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Phone size={18} />
                    <span className="text-sm font-semibold">{t('call')}</span>
                </a>
                <a href={`https://wa.me/${orderDetails.pickupLocationDetails.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-sm font-semibold">{t('message')}</span>
                </a>
            </div>
        </div>

        {/* Rental Docs Link for active state */}
        {isRentalActive && (
            <button onClick={() => setView(AppView.COMPLETION)} className="w-full mt-4 bg-white rounded-xl shadow p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center">
                    <FileText className="text-gray-500 mr-3" />
                    <span className="font-semibold text-gray-700">{t('rentalDocuments')}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
            </button>
        )}

      </main>
    </div>
  );
};

export default OverviewScreen;