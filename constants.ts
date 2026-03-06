import { TicketTier } from './types';

// Price Configuration - Easily adjustable
export const PRICES = {
  EARLY_BIRD: 0.50, // Changed to 0.50 for testing as requested
  GENERAL_ADMISSION: 79.00,
  VIP_PLATINUM: 149.00,
  PROCESSING_FEE: 0.1,
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: PRICES.EARLY_BIRD,
    description: 'per person',
    badge: 'Limited',
    features: [
      'Standard Entry Bracelet',
      'Access to all Main Stages',
      'Food & Beverage Zones'
    ]
  },
  {
    id: 'general-admission',
    name: 'General Admission',
    price: PRICES.GENERAL_ADMISSION,
    description: 'per person',
    isPopular: true,
    badge: 'Most Popular',
    features: [
      'Standard QR Bracelet',
      'Full Event Access',
      'Merchandise Voucher (10% off)'
    ]
  },
  {
    id: 'vip-platinum',
    name: 'VIP Platinum',
    price: PRICES.VIP_PLATINUM,
    description: 'per person',
    isPremium: true,
    badge: 'Premium',
    features: [
      'Premium NFC Silicon Bracelet',
      'Priority Express Entry',
      'VIP Lounge & Backstage Bar',
      '2 Drink Vouchers Included'
    ]
  }
];