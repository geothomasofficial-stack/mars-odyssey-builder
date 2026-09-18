export type TravelerInfo = {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  emergencyContact: string;
  biometricVerified: boolean;
};

export type PassportCredential = {
  id: string;
  issueDate: string;
  authorizationCode: string;
  biometricHash: string;
  traveler: TravelerInfo;
};

export type Journey = {
  origin: string;
  craft: string;
  destination: string;
  travelers: number;
  residence: string;
  perks: string[];
  activities: string[];
  departureDate: string;
  tier: string;
  passport?: PassportCredential;
};