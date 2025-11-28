
import React, { useState, useContext } from 'react';
import { AppView, OrderDetails } from '../types';
import { ArrowLeft, CreditCard, Lock, CheckCircle, AlertCircle, ChevronDown, Home } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

interface DepositScreenProps {
  setView: (view: AppView) => void;
  orderDetails: OrderDetails;
  onDepositComplete: () => void;
}

const DepositScreen: React.FC<DepositScreenProps> = ({ setView, orderDetails, onDepositComplete }) => {
  const { t } = useContext(LanguageContext);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('CHINA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isPaid = orderDetails.isDepositPaid;

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').trim().slice(0, 5);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate Cardholder Name Match
    const normalizedInputName = cardholderName.trim().toLowerCase();
    const normalizedCustomerName = orderDetails.customer.name.trim().toLowerCase();

    // Mock Name check logic (allows substring match for "Mr. Smith")
    const isNameMatch = normalizedInputName === normalizedCustomerName || 
                        (normalizedInputName.includes("smith") && normalizedCustomerName.includes("smith"));

    setTimeout(() => {
      if (!isNameMatch) {
        setError(t('nameMismatchError'));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        onDepositComplete();
      }
    }, 1500);
  };

  if (isPaid) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10">
            <button onClick={() => setView(AppView.OVERVIEW)} className="mr-4">
            <ArrowLeft className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold">{t('depositTitle')}</h1>
        </header>
        
        <div className="flex-grow p-6 flex flex-col items-center justify-center">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600 w-8 h-8" />
                </div>
                
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{t('depositSuccessTitle')}</h2>
                    <p className="text-gray-500 mt-2 text-sm">{t('depositSuccessMessage')}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t('depositAmount')}</span>
                        <span className="font-bold text-gray-800">{orderDetails.deposit.currency} {orderDetails.deposit.amount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{t('transactionId')}</span>
                        <span className="font-medium text-gray-800 font-mono">pi_3M...2lX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t('status')}</span>
                        <span className="font-bold text-green-600">{t('statusCaptured')}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center text-gray-400 text-xs font-bold">
                     <span className="opacity-70">{t('poweredByStripe')}</span>
                </div>

                <button 
                    onClick={() => setView(AppView.OVERVIEW)}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
                >
                    <Home size={18} className="mr-2" />
                    {t('backToHome')}
                </button>
            </div>
        </div>
      </div>
    );
  }

  // Format date range (e.g. 17 Jun 2025 - 23 Jun 2025)
  // Mock logic assuming date strings are somewhat standard
  const startDate = new Date(orderDetails.rentalPeriod.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDate = new Date(orderDetails.rentalPeriod.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const startTime = new Date(orderDetails.rentalPeriod.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(orderDetails.rentalPeriod.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-primary p-4 flex items-center shadow-md text-white sticky top-0 z-10">
        <button onClick={() => setView(AppView.OVERVIEW)} className="mr-4">
          <ArrowLeft className="text-white" />
        </button>
        <h1 className="text-lg font-bold">{t('depositTitle')}</h1>
        <div className="ml-auto">
             {/* Placeholder for menu dots */}
             <div className="flex space-x-1">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
             </div>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-5 mb-4">
            {/* Context Header */}
            <div className="text-gray-500 text-sm mb-4 leading-relaxed">
                <span className="font-semibold text-gray-700">{orderDetails.vehicle.name}</span> - {orderDetails.rentalPeriod.duration} ({startDate}, {startTime} - {endDate}, {endTime}) - {orderDetails.pickupLocationDetails.name}
            </div>

            {/* Price */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                {t('totalPrice')}: {orderDetails.deposit.currency} {orderDetails.totalPrice.toFixed(2)}
            </h2>

            {/* Blue Alert Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    {t('preAuthDeposit')}: {orderDetails.deposit.currency} {orderDetails.deposit.amount.toFixed(2)}
                </h3>
                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {t('depositExplanation')}
                </p>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Form */}
            <form onSubmit={handlePay} className="space-y-5">
                
                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">{t('emailLabel')}</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailPlaceholder')}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition placeholder-gray-400"
                    />
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">{t('countryLabel')}</label>
                    <div className="relative">
                        <select 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition appearance-none bg-white"
                        >
                            <option value="CHINA">CHINA</option>
                            <option value="USA">USA</option>
                            <option value="JAPAN">JAPAN</option>
                            <option value="THAILAND">THAILAND</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Cardholder */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">{t('cardholderName')}</label>
                    <input 
                        type="text" 
                        required
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder={t('cardholderNamePlaceholder')}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none transition placeholder-gray-400"
                    />
                </div>

                {/* Card Info Group */}
                <div>
                     <label className="block text-sm font-bold text-gray-800 mb-1">{t('cardDetails')}</label>
                     <div className="border border-gray-300 rounded overflow-hidden">
                        <div className="relative border-b border-gray-300">
                             <input 
                                type="text" 
                                required
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                placeholder="**** **** **** 1234"
                                maxLength={19}
                                className="w-full p-3 outline-none placeholder-gray-400 font-mono"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                                {/* Basic Card Icons Placeholder */}
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div className="flex">
                            <input 
                                type="text" 
                                required
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                placeholder={t('expiryDate')}
                                maxLength={5}
                                className="w-1/2 p-3 border-r border-gray-300 outline-none placeholder-gray-400 text-center"
                            />
                            <input 
                                type="password" 
                                required
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder={t('cvc')}
                                maxLength={4}
                                className="w-1/2 p-3 outline-none placeholder-gray-400 text-center"
                            />
                        </div>
                     </div>
                </div>

                <div className="flex items-center">
                    <input 
                        id="save-info" 
                        type="checkbox" 
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        defaultChecked
                    />
                    <label htmlFor="save-info" className="ml-2 text-sm text-gray-800 font-medium">
                        {t('secureSave')}
                    </label>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-start">
                        <AlertCircle size={16} className="mt-0.5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading || !cardNumber || !expiry || !cvc || !cardholderName}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded shadow-md hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                    ) : (
                        t('pay')
                    )}
                </button>

                <div className="text-center pt-4 pb-2">
                     <p className="text-gray-400 font-bold text-sm flex items-center justify-center">
                        powered by <span className="text-gray-800 ml-1">stripe</span>
                     </p>
                     <p className="text-gray-400 text-xs mt-1">terms & privacy</p>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default DepositScreen;
