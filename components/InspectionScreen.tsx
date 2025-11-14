import React, { useState, useRef, useCallback, useContext } from 'react';
import { AppView, PhotoFile } from '../types';
import { ArrowLeft, Car, Fuel, Gauge, Lightbulb, MessageSquare, Plus, Trash2, HelpCircle, X } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface InspectionScreenProps {
  setView: (view: AppView) => void;
  onInspectionComplete: () => void;
}

const PhotoUpload: React.FC<{ label: string; onFilesChange: (files: PhotoFile[]) => void; }> = ({ label, onFilesChange }) => {
    const { t } = useContext(LanguageContext);
    const [photos, setPhotos] = useState<PhotoFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            // FIX: Explicitly type `file` as `File` to resolve type errors.
            const newFiles = Array.from(event.target.files).map((file: File) => ({
                id: `${file.name}-${Date.now()}`,
                file,
                preview: URL.createObjectURL(file)
            }));
            const updatedPhotos = [...photos, ...newFiles].slice(0, 3);
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
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex items-center space-x-2">
                {photos.map(photo => (
                    <div key={photo.id} className="relative">
                        <img src={photo.preview} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                        <button onClick={() => removePhoto(photo.id)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
                {photos.length < 3 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center h-20 w-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-200">
                        <Plus size={24} />
                        <span className="text-xs">{t('addPhoto')}</span>
                    </button>
                )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple capture="environment" />
        </div>
    );
};

const InspectionScreen: React.FC<InspectionScreenProps> = ({ setView, onInspectionComplete }) => {
  const { t } = useContext(LanguageContext);
  const [fuelLevel, setFuelLevel] = useState('');
  const [dashboardPhotos, setDashboardPhotos] = useState<PhotoFile[]>([]);
  const [hasDamage, setHasDamage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onInspectionComplete();
  };
  
  const photoGuideItems = [
      { img: 'https://i.ibb.co/b63x1s5/front-left.png', label: t('photoAngleFrontLeft') },
      { img: 'https://i.ibb.co/StL4qJ0/front-right.png', label: t('photoAngleFrontRight') },
      { img: 'https://i.ibb.co/CJq5m8R/rear-left.png', label: t('photoAngleRearLeft') },
      { img: 'https://i.ibb.co/3kM4vL5/rear-right.png', label: t('photoAngleRearRight') },
      { img: 'https://i.ibb.co/yQ0wB9p/dashboard.png', label: t('photoDashboard') },
      { img: 'https://i.ibb.co/GQLsYw0/damage.png', label: t('photoDamage') },
  ];
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
            <button onClick={() => setView(AppView.OVERVIEW)} className="mr-4">
              <ArrowLeft className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold">{t('inspectionTitle')}</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center text-sm text-primary font-semibold">
            <HelpCircle size={16} className="mr-1"/>
            {t('photoGuide')}
        </button>
      </header>

      <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-6">
        {/* Section 1: Dashboard */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold flex items-center mb-4"><Gauge className="mr-2 text-primary"/>{t('dashboardTitle')}</h2>
          <div className="space-y-4">
              <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">{t('mileageLabel')}</label>
                  <div className="mt-1">
                      <input type="number" id="mileage" className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm" placeholder={t('mileagePlaceholder')} />
                  </div>
              </div>
              <div>
                  <label htmlFor="fuelLevel" className="block text-sm font-medium text-gray-700">{t('fuelLevelLabel')}</label>
                  <div className="mt-1 relative">
                    <input
                        type="number"
                        id="fuelLevel"
                        value={fuelLevel}
                        onChange={(e) => setFuelLevel(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm pr-8"
                        placeholder={t('fuelLevelPlaceholder')}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">L</span>
                    </div>
                  </div>
              </div>
              <PhotoUpload label={t('photoDashboard')} onFilesChange={setDashboardPhotos}/>
          </div>
        </div>

        {/* Section 2: Exterior */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold flex items-center mb-4"><Car className="mr-2 text-primary"/>{t('exteriorTitle')}</h2>
          <div className="grid grid-cols-2 gap-4">
              <PhotoUpload label={t('exteriorFront')} onFilesChange={() => {}}/>
              <PhotoUpload label={t('exteriorRear')} onFilesChange={() => {}}/>
              <PhotoUpload label={t('exteriorLeft')} onFilesChange={() => {}}/>
              <PhotoUpload label={t('exteriorRight')} onFilesChange={() => {}}/>
          </div>
        </div>
        
        {/* Section 3: Lights */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold flex items-center mb-4"><Lightbulb className="mr-2 text-primary"/>{t('lightsTitle')}</h2>
          <div className="grid grid-cols-2 gap-4">
              <PhotoUpload label={t('lightsFront')} onFilesChange={() => {}}/>
              <PhotoUpload label={t('lightsRear')} onFilesChange={() => {}}/>
          </div>
        </div>

        {/* Section 4: Damage Report */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold flex items-center mb-4"><MessageSquare className="mr-2 text-primary"/>{t('damageTitle')}</h2>
          <p className="text-sm text-gray-600 mb-3">{t('damageQuestion')}</p>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center">
                <input type="radio" name="damage" checked={!hasDamage} onChange={() => setHasDamage(false)} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"/>
                <span className="ml-2 text-sm">{t('no')}</span>
            </label>
            <label className="flex items-center">
                <input type="radio" name="damage" checked={hasDamage} onChange={() => setHasDamage(true)} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"/>
                <span className="ml-2 text-sm">{t('yes')}</span>
            </label>
          </div>
          {hasDamage && (
            <div className="space-y-4">
                <textarea placeholder={t('damagePlaceholder')} rows={3} className="w-full p-2 border border-gray-300 rounded-md text-sm"></textarea>
                <PhotoUpload label={t('damagePhotos')} onFilesChange={() => {}}/>
            </div>
          )}
        </div>
        
      </form>

      <div className="p-4 bg-white border-t sticky bottom-0">
          <button type="submit" onClick={handleSubmit} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
            {t('continueToContract')}
          </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white w-full max-w-md rounded-t-2xl pb-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 relative">
                     <h2 className="text-lg font-bold text-center">{t('photoGuideTitle')}</h2>
                     <button onClick={() => setIsModalOpen(false)} className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 hover:text-gray-800">
                        <X size={24} />
                     </button>
                </div>

                <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-600">{t('photoGuideSubtitle1')}</p>
                    <div className="grid grid-cols-2 gap-4">
                        {photoGuideItems.slice(0, 4).map(item => (
                            <div key={item.label} className="rounded-lg overflow-hidden border border-gray-200">
                                <img src={item.img} alt={item.label} className="w-full h-auto object-cover aspect-[4/3] bg-gray-100"/>
                                <p className="text-center text-sm font-medium text-white bg-gray-700 py-1.5">{item.label}</p>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-sm text-gray-600">{t('photoGuideSubtitle2')}</p>
                    <div className="grid grid-cols-2 gap-4">
                        {photoGuideItems.slice(4, 6).map(item => (
                             <div key={item.label} className="rounded-lg overflow-hidden border border-gray-200">
                                <img src={item.img} alt={item.label} className="w-full h-auto object-cover aspect-[4/3] bg-gray-100"/>
                                <p className="text-center text-sm font-medium text-white bg-gray-700 py-1.5">{item.label}</p>
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

export default InspectionScreen;