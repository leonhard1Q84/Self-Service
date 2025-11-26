
import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import OverviewScreen from './components/OverviewScreen';
import InspectionScreen from './components/InspectionScreen';
import ContractScreen from './components/ContractScreen';
import CompletionScreen from './components/CompletionScreen';
import ReservationDetailsScreen from './components/ReservationDetailsScreen';
import DepositScreen from './components/DepositScreen';
import VehicleStatusScreen from './components/VehicleStatusScreen';
import { AppView, OrderDetails } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const mockOrderDetails: OrderDetails = {
  orderNumber: 'ORD-2025-1026-001',
  confirmationCode: 'WMQ677027', // Kept for login
  rentalPeriod: {
    start: '2025-10-28 10:00',
    end: '2025-10-31 18:00',
    duration: '3 Days',
  },
  totalPrice: 365.00,
  vehicle: {
    name: 'Toyota Camry or similar',
    image: 'https://i.ibb.co/6nZJ31m/camry.png',
    licensePlate: 'BA23-328',
    state: 'Connecticut',
    color: 'WHITE',
    fuelLevel: 85,
    range: 420,
    odometer: 12450,
    parkingSpot: 'A-23',
    isLocked: true,
    coordinates: {
        lat: 35.6895,
        lng: 139.6917 // Example: Tokyo
    }
  },
  pickupLocation: 'Beijing Capital International Airport T3, 1st Floor, Arrivals Hall A',
  pickupLocationDetails: {
    name: 'Beijing Airport T3 Store',
    phone: '+861064532623'
  },
  pickupInstructions: 'Go to the 1st floor arrivals hall, turn left at Starbucks, walk 200m to the elevator, go to B1 parking, zone A.',
  returnLocation: 'Beijing Capital International Airport T3, 1st Floor, Arrivals Hall A',
  customer: {
    name: 'Mr. Smith',
    phone: '138****8888',
  },
  contract: {
    number: 'CO-2025-1026-001',
    date: '2025-10-26',
  },
  deposit: {
    amount: 1000, // Updated to match screenshot example
    currency: '$', // Updated currency symbol
  },
  pickupStatus: 'Awaiting Pickup',
  preparationStatus: 'Vehicle preparation complete, estimated 08/07 14:30',
  isIdentityVerified: true,
  isDepositPaid: false, // Initially false
  isRentalActive: false, // Initially false
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.AUTH);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [inspectionCompleted, setInspectionCompleted] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);


  useEffect(() => {
    // Simulate fetching order details after authentication
    if (currentView !== AppView.AUTH && !orderDetails) {
      setOrderDetails(mockOrderDetails);
    }
  }, [currentView, orderDetails]);

  const handleAuthSuccess = () => {
    setCurrentView(AppView.OVERVIEW);
  };

  const handleDepositComplete = () => {
    if (orderDetails) {
        setOrderDetails({ ...orderDetails, isDepositPaid: true });
    }
  }

  const handleInspectionComplete = () => {
    setInspectionCompleted(true);
    setCurrentView(AppView.CONTRACT);
  }

  const handleContractSign = () => {
    setContractSigned(true);
    setCurrentView(AppView.COMPLETION);
  }
  
  const handleStartRental = () => {
      if (orderDetails) {
          setOrderDetails({ ...orderDetails, isRentalActive: true });
          setCurrentView(AppView.OVERVIEW);
      }
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.AUTH:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
      case AppView.OVERVIEW:
        return orderDetails && <OverviewScreen orderDetails={orderDetails} setView={setCurrentView} inspectionCompleted={inspectionCompleted} contractSigned={contractSigned} />;
      case AppView.DEPOSIT:
        return orderDetails && <DepositScreen orderDetails={orderDetails} setView={setCurrentView} onDepositComplete={handleDepositComplete} />;
      case AppView.INSPECTION:
        return <InspectionScreen setView={setCurrentView} onInspectionComplete={handleInspectionComplete} />;
      case AppView.CONTRACT:
        return orderDetails && <ContractScreen orderDetails={orderDetails} setView={setCurrentView} onContractSign={handleContractSign} />;
      case AppView.RESERVATION_DETAILS:
        return orderDetails && <ReservationDetailsScreen orderDetails={orderDetails} setView={setCurrentView} />;
      case AppView.COMPLETION:
        return orderDetails && <CompletionScreen orderDetails={orderDetails} setView={setCurrentView} onStartRental={handleStartRental} />;
      case AppView.VEHICLE_STATUS:
        return orderDetails && <VehicleStatusScreen orderDetails={orderDetails} setView={setCurrentView} />;
      default:
        return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen font-sans antialiased text-gray-800">
        <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
          {renderContent()}
        </div>
      </div>
    </LanguageProvider>
  );
};

export default App;