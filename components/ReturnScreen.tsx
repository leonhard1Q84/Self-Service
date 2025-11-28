
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppView, OrderDetails, PhotoFile } from '../types';
import { ArrowLeft, Fuel, Camera, MapPin, Key, Lightbulb, Lock, CheckCircle, AlertTriangle, X, Gauge, HelpCircle, Car } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface ReturnScreenProps {
  setView: (view: AppView) => void;
  orderDetails: OrderDetails;
  onReturnComplete: () => void;
}

const PhotoUpload: React.FC<{ label: string; onFilesChange: (files: PhotoFile[]) => void; }> = ({ label, onFilesChange }) => {
    const { t } = useContext(LanguageContext);
    const [photos, setPhotos] = useState<PhotoFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map((file: File) => ({
                id: `${file.name}-${Date.now()}`,
                file,
                preview: URL.createObjectURL(file)
            }));
            const updatedPhotos = [...photos, ...newFiles].slice(0, 1); // Allow 1 photo per angle
            setPhotos(updatedPhotos);
            onFilesChange(updatedPhotos);
        }
    };
    
    const removePhoto = (id: string) => {
        const updatedPhotos = photos.filter(p => p.id !== id);
        setPhotos(updatedPhotos);
        onFilesChange(updatedPhotos);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center min-h-[120px] relative">
            {photos.length > 0 ? (
                <div className="relative w-full h-full">
                    <img src={photos[0].preview} alt="preview" className="w-full h-28 object-cover rounded-md" />
                    <button onClick={() => removePhoto(photos[0].id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm z-10">
                        <X size={12} />
                    </button>
                    <div className="mt-1 text-center text-[10px] font-medium text-gray-600 truncate w-full">{label}</div>
                </div>
            ) : (
                <div className="flex flex-col items-center cursor-pointer w-full h-full justify-center" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                         <Camera size={20} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 text-center">{label}</span>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" capture="environment" />
        </div>
    );
};

const ReturnScreen: React.FC<ReturnScreenProps> = ({ setView, orderDetails, onReturnComplete }) => {
  const { t } = useContext(LanguageContext);
  const [step, setStep] = useState<1 | 2>(1); // 1: Stats/Photos, 2: Instructions
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Mock end trip stats (simulating data synced from vehicle)
  const [vehicleStats] = useState({
      fuel: 68, // Changed from start
      mileage: orderDetails.vehicle.odometer + 150 // Increased from start
  });
  
  // Simulated Location Check
  useEffect(() => {
      if (step === 2) {
          setIsCheckingLocation(true);
          setTimeout(() => {
              setIsLocationValid(true);
              setIsCheckingLocation(false);
          }, 2000);
      }
  }, [step]);

  const handleNext = () => {
      setStep(2);
  };

  const handleConfirmReturn = () => {
      setShowModal(false);
      onReturnComplete();
  };

  const photoGuideItems = [
      { img: 'https://i.ibb.co/b63x1s5/front-left.png', label: t('photoAngleFrontLeft') },
      { img: 'https://i.ibb.co/StL4qJ0/front-right.png', label: t('photoAngleFrontRight') },
      { img: 'https://i.ibb.co/CJq5m8R/rear-left.png', label: t('photoAngleRearLeft') },
      { img: 'https://i.ibb.co/3kM4vL5/rear-right.png', label: t('photoAngleRearRight') },
      { img: 'https://i.ibb.co/GQLsYw0/damage.png', label: t('photoDamage') },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => step === 1 ? setView(AppView.OVERVIEW) : setStep(1)} className="mr-4">
          <ArrowLeft className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold flex-1">{t('returnTitle')}</h1>
        {step === 1 && (
             <button onClick={() => setIsGuideOpen(true)} className="flex items-center text-sm text-primary font-semibold">
                <HelpCircle size={16} className="mr-1"/>
                {t('photoGuide')}
            </button>
        )}
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {step === 1 && (
            <>
                 {/* Section 1: Vehicle Stats (Read-Only) */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="font-bold flex items-center mb-4 text-gray-800"><Gauge className="mr-2 text-primary"/>{t('dashboardTitle')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-500 mb-1">{t('mileageLabel')}</span>
                            <span className="block text-lg font-mono font-bold text-gray-800">{vehicleStats.mileage.toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="block text-xs text-gray-500 mb-1">{t('fuelLevelLabel')}</span>
                            <span className="block text-lg font-mono font-bold text-gray-800">{vehicleStats.fuel}%</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center italic">
                        * Data synced from vehicle computer
                    </p>
                </div>

                {/* Section 2: Photos */}
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <h2 className="font-bold flex items-center mb-4 text-gray-800"><Car className="mr-2 text-primary"/>{t('returnPhotosInstruction')}</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <PhotoUpload label={t('exteriorFront')} onFilesChange={() => {}} />
                        <PhotoUpload label={t('exteriorRear')} onFilesChange={() => {}} />
                        <PhotoUpload label={t('exteriorLeft')} onFilesChange={() => {}} />
                        <PhotoUpload label={t('exteriorRight')} onFilesChange={() => {}} />
                    </div>
                </div>

                {/* Section 3: Additional Photos */}
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="font-bold text-gray-800 mb-4 text-sm">{t('damagePhotos')} (Optional)</h2>
                    <PhotoUpload label={t('addPhoto')} onFilesChange={() => {}} />
                </div>
            </>
        )}

        {step === 2 && (
             <div className="bg-white p-5 rounded-xl shadow-sm space-y-6 animate-fade-in">
                 {/* Location Check */}
                 <div className="border-b border-gray-100 pb-4">
                     <h2 className="font-bold text-gray-800 mb-2 flex items-center">
                         <MapPin className="mr-2 text-primary" size={20} />
                         {t('reservationDetailsTitle')}
                     </h2>
                     <p className="text-sm text-gray-600 mb-3">Ensure your vehicle returned to the correct location</p>
                     
                     <div className={`p-3 rounded-lg flex items-center text-sm font-medium ${isCheckingLocation ? 'bg-yellow-50 text-yellow-700' : isLocationValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                         {isCheckingLocation ? (
                             <>
                                <span className="animate-spin mr-2">⏳</span>
                                {t('checkLocation')}
                             </>
                         ) : isLocationValid ? (
                             <>
                                <CheckCircle size={16} className="mr-2" />
                                {orderDetails.returnLocation}
                             </>
                         ) : (
                             <>
                                <AlertTriangle size={16} className="mr-2" />
                                {t('locationError')}
                             </>
                         )}
                     </div>
                 </div>

                 {/* Key Instruction */}
                 <div className="border-b border-gray-100 pb-4">
                     <div className="flex items-start">
                         <Key className="mr-3 text-gray-500 mt-0.5" size={20} />
                         <div>
                             <p className="text-sm text-gray-800 font-medium leading-relaxed">{t('returnKeyInstruction')}</p>
                         </div>
                     </div>
                 </div>

                 {/* Lights Instruction */}
                 <div className="border-b border-gray-100 pb-4 flex items-center">
                      <Lightbulb className="mr-3 text-gray-500" size={20} />
                      <p className="text-sm text-gray-800 font-medium">{t('returnLightsInstruction')}</p>
                 </div>

                 {/* Lock Instruction */}
                 <div className="flex items-center">
                      <Lock className="mr-3 text-gray-500" size={20} />
                      <p className="text-sm text-gray-800 font-bold">{t('returnLockInstruction')}</p>
                 </div>
             </div>
        )}
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0">
          {step === 1 ? (
               <button onClick={handleNext} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                 {t('continue')}
               </button>
          ) : (
               <button 
                onClick={() => setShowModal(true)} 
                disabled={!isLocationValid}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {t('endTrip')}
               </button>
          )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl animate-scale-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('endTripModalTitle')}</h3>
                  <p className="text-sm text-gray-600 mb-4">{t('endTripModalBody')}</p>
                  
                  <ul className="text-left text-sm text-gray-700 space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
                      <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          {t('endTripModalPoint1')}
                      </li>
                      <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          {t('endTripModalPoint2')}
                      </li>
                      <li className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          {t('endTripModalPoint3')}
                      </li>
                  </ul>

                  <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setShowModal(false)}
                        className="py-2.5 px-4 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                      >
                          {t('cancel')}
                      </button>
                      <button 
                        onClick={handleConfirmReturn}
                        className="py-2.5 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
                      >
                          {t('confirmEndTrip')}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Photo Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50" onClick={() => setIsGuideOpen(false)}>
            <div className="bg-white w-full max-w-md rounded-t-2xl pb-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 relative">
                     <h2 className="text-lg font-bold text-center">{t('photoGuideTitle')}</h2>
                     <button onClick={() => setIsGuideOpen(false)} className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 hover:text-gray-800">
                        <X size={24} />
                     </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
                    <p className="text-sm text-gray-600">{t('photoGuideSubtitle1')}</p>
                    <div className="grid grid-cols-2 gap-4">
                        {photoGuideItems.slice(0, 4).map(item => (
                            <div key={item.label} className="rounded-lg overflow-hidden border border-gray-200">
                                <img src={item.img} alt={item.label} className="w-full h-auto object-cover aspect-[4/3] bg-gray-100"/>
                                <p className="text-center text-xs font-medium text-white bg-gray-700 py-1.5">{item.label}</p>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2">{t('photoGuideSubtitle2')}</p>
                    <div className="grid grid-cols-2 gap-4">
                        {photoGuideItems.slice(4, 5).map(item => (
                             <div key={item.label} className="rounded-lg overflow-hidden border border-gray-200">
                                <img src={item.img} alt={item.label} className="w-full h-auto object-cover aspect-[4/3] bg-gray-100"/>
                                <p className="text-center text-xs font-medium text-white bg-gray-700 py-1.5">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ReturnScreen;
