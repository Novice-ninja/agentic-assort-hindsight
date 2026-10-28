export type LocationClimate = 'temperate' | 'cold';
export type CustomerType = 'premium' | 'mainstream' | 'conservative' | 'value';
export type FulfillmentType = 'storePickUp' | 'shipToStore' | 'delivery';
export type IncomeLevel = 'high' | 'middle' | 'lowerMiddle';
export type LocationType = 'store' | 'outlet';

export interface AdminLocation {
  id: string;
  name: string;
  city?: string;
  lat: number;
  lon: number;
  climate: LocationClimate;
  customerType: CustomerType;
  fulfillmentType: FulfillmentType;
  incomeLevel: IncomeLevel;
  locationType: LocationType;
}

export const LOCATION_CLIMATE_OPTIONS: LocationClimate[] = ['temperate', 'cold'];
export const CUSTOMER_TYPE_OPTIONS: CustomerType[] = [
  'premium',
  'mainstream',
  'conservative',
  'value',
];
export const FULFILLMENT_TYPE_OPTIONS: FulfillmentType[] = [
  'storePickUp',
  'shipToStore',
  'delivery',
];
export const INCOME_LEVEL_OPTIONS: IncomeLevel[] = ['high', 'middle', 'lowerMiddle'];
export const LOCATION_TYPE_OPTIONS: LocationType[] = ['store', 'outlet'];
