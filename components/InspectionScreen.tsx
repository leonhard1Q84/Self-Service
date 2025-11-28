
import React, { useState, useRef, useContext, useEffect } from 'react';
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
  // Mock data reading from vehicle system
  const [vehicleStats] = useState({
      fuel: 85,
      mileage: 12450
  });

  const [additionalComments, setAdditionalComments] = useState('');
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
        {/* Section 1: Vehicle Stats (Read-Only) */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold flex items-center mb-4"><Gauge className="mr-2 text-primary"/>{t('dashboardTitle')}</h2>
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
          <p className="text-xs text-gray-400 mt-2 text-center italic">
              * Data synced from vehicle computer
          </p>
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

        {/* Section 4: Damage Report (Simplified) */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-bold flex items-center mb-4"><MessageSquare className="mr-2 text-primary"/>{t('carIssuesTitle')}</h2>
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('additionalComments')}</label>
                <textarea 
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder={t('additionalCommentsPlaceholder')} 
                    rows={3} 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                ></textarea>
             </div>
             <PhotoUpload label={t('damagePhotos')} onFilesChange={() => {}}/>
          </div>
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

                <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
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
