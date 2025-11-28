
import React, { useContext, useState } from 'react';
import { AppView } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';
import { Star, CheckCircle, Home, Lock, FileText } from 'lucide-react';

interface TripEndedScreenProps {
  setView: (view: AppView) => void;
}

const TripEndedScreen: React.FC<TripEndedScreenProps> = ({ setView }) => {
  const { t } = useContext(LanguageContext);
  const [rating, setRating] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
       <header className="bg-white p-4 flex items-center justify-center shadow-sm sticky top-0 z-10">
        <h1 className="text-lg font-bold">{t('tripEndedTitle')}</h1>
      </header>

      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
              <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="text-green-600 w-10 h-10" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('tripEndedTitle')}</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  {t('tripEndedMessage')}
              </p>

              <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-center justify-center text-gray-600 text-sm">
                   <Lock size={16} className="mr-2 text-gray-400" />
                   {t('digitalKeyDisabled')}
              </div>

              <hr className="border-gray-100 mb-6"/>

              <h3 className="font-bold text-gray-700 mb-4">{t('rateYourTrip')}</h3>
              <div className="flex justify-center space-x-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setRating(star)}
                        className={`transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          <Star size={32} fill={star <= rating ? "currentColor" : "none"} />
                      </button>
                  ))}
              </div>
              
              <button className="w-full mb-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <FileText size={18} className="mr-2" />
                  {t('receipt')}
              </button>

              <button 
                onClick={() => setView(AppView.OVERVIEW)}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center shadow-md"
              >
                  <Home size={18} className="mr-2" />
                  {t('backToHome')}
              </button>
          </div>
      </div>
    </div>
  );
};

export default TripEndedScreen;
