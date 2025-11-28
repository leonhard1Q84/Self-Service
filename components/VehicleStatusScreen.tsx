
import React, { useContext, useState } from 'react';
import { AppView, OrderDetails } from '../types';
import { ArrowLeft, Lightbulb, Volume2, Navigation, MapPin, CheckCircle, Phone, MessageSquare, Info, X } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface VehicleStatusScreenProps {
  orderDetails: OrderDetails;
  setView: (view: AppView) => void;
}

const VehicleStatusScreen: React.FC<VehicleStatusScreenProps> = ({ orderDetails, setView }) => {
  const { t } = useContext(LanguageContext);
  const { vehicle } = orderDetails;
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleAction = (action: string) => {
    setActiveAction(action);
    setTimeout(() => setActiveAction(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
       <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => setView(AppView.OVERVIEW)} className="mr-4">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold">{t('vehicleDetails')}</h1>
      </header>

      {/* Map Section */}
      <div className="h-64 relative bg-gray-200 w-full flex-shrink-0">
          {/* Mock Map Image */}
          <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://i.ibb.co/C0h0q4X/mock-map.png')" }}></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-primary text-white px-3 py-1.5 rounded-full shadow-lg flex items-center animate-bounce">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm font-bold">{vehicle.parkingSpot || 'A-01'}</span>
              </div>
          </div>
          
          {/* Picture Overlay (Clickable) */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-auto">
             <div 
                className="bg-white p-1 rounded-lg shadow-lg cursor-zoom-in active:scale-95 transition-transform"
                onClick={() => setIsImageModalOpen(true)}
             >
                <div className="relative">
                    <img src={vehicle.image} alt="Delivery Photo" className="w-32 h-20 object-cover rounded" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded">
                         {/* Invisible overlay for hover effect */}
                    </div>
                </div>
                <p className="text-[10px] text-center text-gray-500 mt-1 font-medium">{t('tapToZoom')}</p>
             </div>
          </div>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto pb-10">
        
        {/* Vehicle Info */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
             <div className="flex items-center space-x-4 mb-4">
                <img src={vehicle.image} alt={vehicle.name} className="w-24 h-auto object-contain" />
                <div>
                    <h2 className="text-lg font-bold text-gray-900">{vehicle.name}</h2>
                    <p className="text-gray-500 text-sm">{vehicle.color} • {vehicle.licensePlate}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">{t('parkingSpot')}</p>
                    <p className="font-bold text-gray-800 text-lg">{vehicle.parkingSpot}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                     <p className="text-gray-500 text-xs">{t('fuelLevel')}</p>
                    <p className="font-bold text-gray-800 text-lg">{vehicle.fuelLevel}%</p>
                </div>
            </div>
        </div>

        {/* Remote Controls (Flash/Honk Only - No Unlock before contract) */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4">{t('controls')}</h3>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleAction('flash')} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition">
                    <Lightbulb size={24} className="text-orange-500 mb-2" />
                    <span className="text-xs font-medium text-gray-700">{t('actionFlash')}</span>
                </button>
                <button onClick={() => handleAction('honk')} className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition">
                    <Volume2 size={24} className="text-blue-500 mb-2" />
                    <span className="text-xs font-medium text-gray-700">{t('actionHonk')}</span>
                </button>
             </div>
             
             {activeAction && (
                 <div className="mt-4 flex items-center justify-center text-green-600 bg-green-50 py-2 rounded-lg animate-fade-in">
                     <CheckCircle size={16} className="mr-2" />
                     <span className="text-sm font-medium">
                         {t('actionSent')}
                     </span>
                 </div>
             )}
        </div>
        
        {/* Pickup Guidelines Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <Info size={16} className="mr-2 text-primary"/>
                {t('pickupInstructions')}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg">
                {orderDetails.pickupInstructions || t('defaultPickupInstructions')}
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <a href={`tel:${orderDetails.pickupLocationDetails.phone}`} className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Phone size={18} />
                    <span className="text-sm font-semibold">{t('callStore')}</span>
                </a>
                <a href="#" className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-sm font-semibold">{t('messageStore')}</span>
                </a>
            </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isImageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsImageModalOpen(false)}>
              <button 
                onClick={() => setIsImageModalOpen(false)} 
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800 bg-opacity-50"
              >
                  <X size={24} />
              </button>
              <img 
                src={vehicle.image} 
                alt="Delivery Full" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-in" 
                onClick={(e) => e.stopPropagation()}
              />
          </div>
      )}
    </div>
  );
};

export default VehicleStatusScreen;
