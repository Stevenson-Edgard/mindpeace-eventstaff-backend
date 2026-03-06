import { TicketTier } from './types';

// Price Configuration - Easily adjustable
export const PRICES = {
  CHILDREN: 35.00, // Changed to 0.50 for testing as requested
  ADULTS: 50.00,
  VIP_PLATINUM: 150.00,
  PROCESSING_FEE: 5.5,
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'children',
    name: 'Children (Under 10)',
    price: PRICES.CHILDREN,
    description: 'per person',
    badge: 'Limited',
    features: [
      'Standard Entry Bracelet',
      'Access to all Main Stages',
      'Food & Beverage Zones'
    ]
  },
  {
    id: 'adults',
    name: 'Adults (10 and Up)',
    price: PRICES.ADULTS,
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