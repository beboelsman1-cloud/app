export type PlaceType = 'attraction' | 'service';

export type CategoryId =
  | 'all'
  | 'landmarks'
  | 'museums'
  | 'nature'
  | 'entertainment'
  | 'food'
  | 'atm'
  | 'pharmacy'
  | 'mosque'
  | 'transport'
  | 'shopping'
  | 'tourist_info';

export interface CategoryInfo {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isService?: boolean;
}

export interface Place {
  id: string;
  nameAr: string;
  nameEn: string;
  type: PlaceType;
  category: CategoryId;
  cityId: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceLevel: 'free' | '$' | '$$' | '$$$' | '$$$$';
  isOpen: boolean;
  openingHours: string;
  phone?: string;
  addressAr: string;
  addressEn: string;
  descriptionAr: string;
  descriptionEn: string;
  touristTipAr: string;
  touristTipEn: string;
  imageUrl: string;
  tags: string[];
  audioGuideScriptAr?: string;
  audioGuideScriptEn?: string;
  features: {
    hasWifi?: boolean;
    hasParking?: boolean;
    isWheelchairAccessible?: boolean;
    isFamilyFriendly?: boolean;
    acceptsCards?: boolean;
    englishSpoken?: boolean;
  };
}

export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  lat: number;
  lng: number;
  zoom: number;
  currency: string;
  currencySymbol: string;
  currencyRateToUSD: number;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    touristPolice?: string;
  };
  timeZone: string;
  heroImage: string;
  welcomeMessageAr: string;
  welcomeMessageEn: string;
}

export interface ItineraryItem {
  id: string;
  placeId: string;
  order: number;
  notes?: string;
  plannedTime?: string;
  isCompleted?: boolean;
}
