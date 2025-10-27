export enum AppView {
  AUTH = 'AUTH',
  OVERVIEW = 'OVERVIEW',
  INSPECTION = 'INSPECTION',
  CONTRACT = 'CONTRACT',
  RESERVATION_DETAILS = 'RESERVATION_DETAILS',
  COMPLETION = 'COMPLETION',
}

export interface OrderDetails {
  orderNumber: string;
  confirmationCode: string;
  rentalPeriod: {
    start: string;
    end: string;
    duration: string;
  };
  vehicle: {
    name: string;
    image: string;
    licensePlate: string;
    state: string;
    color: string;
  };
  pickupLocation: string;
  pickupLocationDetails: {
    name: string;
    phone: string;
  };
  returnLocation: string;
  customer: {
    name: string;
    phone: string;
  };
  contract: {
    number: string;
    date: string;
  };
  pickupStatus: string;
  preparationStatus: string;
  isIdentityVerified: boolean;
  isDepositPaid: boolean;
}

export interface PhotoFile {
    id: string;
    file: File;
    preview: string;
}