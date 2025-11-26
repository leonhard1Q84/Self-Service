
export enum AppView {
  AUTH = 'AUTH',
  OVERVIEW = 'OVERVIEW',
  INSPECTION = 'INSPECTION',
  CONTRACT = 'CONTRACT',
  RESERVATION_DETAILS = 'RESERVATION_DETAILS',
  COMPLETION = 'COMPLETION',
  DEPOSIT = 'DEPOSIT',
  VEHICLE_STATUS = 'VEHICLE_STATUS',
}

export interface OrderDetails {
  orderNumber: string;
  confirmationCode: string;
  rentalPeriod: {
    start: string;
    end: string;
    duration: string;
  };
  totalPrice: number; // Added total rental price
  vehicle: {
    name: string;
    image: string;
    licensePlate: string;
    state: string;
    color: string;
    fuelLevel: number; // percentage
    range: number; // km
    odometer: number; // km
    parkingSpot?: string;
    isLocked: boolean; // Add lock state
    coordinates?: {
        lat: number;
        lng: number;
    };
  };
  pickupLocation: string;
  pickupLocationDetails: {
    name: string;
    phone: string;
  };
  pickupInstructions: string; // Add explicit instruction field
  returnLocation: string;
  customer: {
    name: string;
    phone: string;
  };
  contract: {
    number: string;
    date: string;
  };
  deposit: {
    amount: number;
    currency: string;
  };
  pickupStatus: string;
  preparationStatus: string;
  isIdentityVerified: boolean;
  isDepositPaid: boolean;
  isRentalActive: boolean; // True after contract sign and user clicks "Start Use"
}

export interface PhotoFile {
    id: string;
    file: File;
    preview: string;
}