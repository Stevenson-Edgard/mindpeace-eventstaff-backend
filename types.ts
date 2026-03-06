export type TicketTier = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  isPopular?: boolean;
  isPremium?: boolean;
};

export type AppState = 'selection' | 'checkout' | 'confirmation';
