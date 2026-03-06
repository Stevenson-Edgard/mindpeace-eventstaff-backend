import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Ticket,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import type { PaymentRequest } from '@stripe/stripe-js';
import { TicketTier } from '../types';
import { PRICES } from '../constants';
import { Button } from '../views/Button';
import { Input } from '../views/Input';
import { Card } from '../views/Card';

interface CheckoutProps {
  selectedTier: TicketTier;
  onBack: () => void;
  onPay: () => void;
  key?: string;
}

type PaymentMethod = 'card' | 'paypal' | 'apple_pay';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#000000',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': {
        color: '#6b7280',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

export default function Checkout({ selectedTier, onBack, onPay }: CheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'US',
    saveCard: false,
  });

  const processingFee = PRICES.PROCESSING_FEE;
  const total = selectedTier.price + processingFee;

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: `${selectedTier.name} Ticket`,
        amount: Math.round(total * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    });

    pr.canMakePayment().then((result) => {
      const available = Boolean(result?.applePay);
      setApplePayAvailable(available);
      setPaymentRequest(available ? pr : null);
      if (!available && paymentMethod === 'apple_pay') setPaymentMethod('card');
    });

    pr.on('paymentmethod', async (ev) => {
      setError(null);
      setIsProcessing(true);

      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          data.clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete('fail');
          throw new Error(confirmError.message);
        }

        ev.complete('success');

        if (paymentIntent?.status === 'requires_action') {
          const { error: actionError, paymentIntent: finalIntent } = await stripe.confirmCardPayment(data.clientSecret);
          if (actionError) throw new Error(actionError.message);
          if (finalIntent?.status === 'succeeded') onPay();
        } else if (paymentIntent?.status === 'succeeded') {
          onPay();
        }
      } catch (err: any) {
        setError(err.message || 'Apple Pay failed. Please try another payment method.');
      } finally {
        setIsProcessing(false);
      }
    });
  }, [stripe, total, selectedTier.name, onPay, paymentMethod]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let valid = true;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      valid = false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      valid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const createIntent = async () => {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total }),
    });
    const data = await response.json();
    if (!response.ok || data.error) throw new Error(data.error || 'Failed to create payment intent');
    return data.clientSecret;
  };

  const handleCardPayment = async () => {
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) throw new Error('Card number field is not ready.');

    const clientSecret = await createIntent();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.address || undefined,
            city: formData.city || undefined,
            postal_code: formData.postalCode || undefined,
            country: formData.country || undefined,
          },
        },
      },
    });

    if (result.error) throw new Error(result.error.message);
    if (result.paymentIntent?.status === 'succeeded') onPay();
  };

  const handlePayPalFlow = async () => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: total,
        name: `${selectedTier.name} Ticket`,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error || !data.url) {
      throw new Error(data.error || 'Failed to start PayPal checkout.');
    }
    window.location.href = data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    if (paymentMethod === 'apple_pay') {
      setError('Use the Apple Pay button above in Express Checkout.');
      return;
    }

    setIsProcessing(true);
    try {
      if (paymentMethod === 'card') {
        await handleCardPayment();
      } else {
        await handlePayPalFlow();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-slate-50"
    >
      <div className="flex items-center p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 flex flex-col items-center pr-8">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-primary rounded-lg flex items-center justify-center text-white">
              <Ticket size={14} />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">MindPeace</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-emerald-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">Secure Checkout</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar pb-10">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Express Checkout</h3>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            {applePayAvailable && paymentRequest ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <PaymentRequestButtonElement
                  options={{
                    paymentRequest,
                    style: {
                      paymentRequestButton: {
                        type: 'buy',
                        theme: 'dark',
                        height: '56px',
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center text-sm font-bold border border-slate-200">
                Apple Pay not available on this device/browser
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Order Summary</h3>
              <button type="button" onClick={onBack} className="text-primary text-sm font-bold hover:underline">Edit Cart</button>
            </div>
            <Card className="p-0 overflow-hidden border-2 border-slate-100 shadow-sm">
              <div className="p-5 flex items-center gap-4 justify-between border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary">
                    <Ticket size={28} />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 leading-tight">{selectedTier.name} Access Pass</p>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">Unique Bracelet ID Included</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">${selectedTier.price.toFixed(2)}</p>
                  <p className="text-xs text-slate-600 font-bold">Qty: 1</p>
                </div>
              </div>
              <div className="p-5 space-y-3 bg-slate-50/50">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-700">Subtotal</span>
                  <span className="text-slate-900">${selectedTier.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-700">Processing Fee</span>
                  <span className="text-slate-900">${processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-3 border-t border-slate-200">
                  <span className="text-slate-900">Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </section>

          <section className="space-y-5">
            <h3 className="text-lg font-black text-slate-900">Contact Information</h3>
            <div className="space-y-4">
              <Input label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} error={formErrors.name} leftIcon={<User size={20} />} className="text-black placeholder:text-slate-500" />
              <Input label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} error={formErrors.email} leftIcon={<Mail size={20} />} className="text-black placeholder:text-slate-500" />
              <Input label="Phone Number" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleInputChange} error={formErrors.phone} leftIcon={<Phone size={20} />} className="text-black placeholder:text-slate-500" />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-lg font-black text-slate-900">Billing Address</h3>
            <div className="space-y-4">
              <Input label="Street Address" name="address" placeholder="123 Festival Way" value={formData.address} onChange={handleInputChange} leftIcon={<MapPin size={20} />} className="text-black placeholder:text-slate-500" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" name="city" placeholder="Denver" value={formData.city} onChange={handleInputChange} className="text-black placeholder:text-slate-500" />
                <Input label="Postal Code" name="postalCode" placeholder="80202" value={formData.postalCode} onChange={handleInputChange} className="text-black placeholder:text-slate-500" />
              </div>
              <Input label="Country Code" name="country" placeholder="US" value={formData.country} onChange={handleInputChange} className="text-black placeholder:text-slate-500" />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-lg font-black text-slate-900">Payment Method</h3>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-slate-900" />
                    <span className="text-sm font-black text-slate-900">Card (Stripe)</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Visa / Mastercard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'paypal' ? 'border-[#003087] bg-[#003087]/5' : 'border-slate-200 bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">PayPal</span>
                  <span className="text-xs font-bold text-[#003087]">Redirect Checkout</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => applePayAvailable && setPaymentMethod('apple_pay')}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === 'apple_pay' ? 'border-black bg-black/5' : 'border-slate-200 bg-white'} ${!applePayAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">Apple Pay</span>
                  <span className="text-xs font-bold text-slate-700">{applePayAvailable ? 'Available' : 'Unavailable'}</span>
                </div>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-5 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Card Number</label>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all focus-within:bg-white text-black">
                    <CardNumberElement options={ELEMENT_OPTIONS} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Expiry Date</label>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all focus-within:bg-white text-black">
                      <CardExpiryElement options={ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">CVC</label>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all focus-within:bg-white text-black">
                      <CardCvcElement options={ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                  <input type="checkbox" id="save-card" name="saveCard" checked={formData.saveCard} onChange={handleInputChange} className="size-4 rounded border-slate-300 text-primary focus:ring-primary/20" />
                  <label htmlFor="save-card" className="text-xs font-bold text-slate-700 cursor-pointer">Save card for future purchases</label>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <Card className="p-4 bg-white border-slate-200">
                <p className="text-sm font-semibold text-slate-700">You will be redirected to secure checkout after pressing the pay button.</p>
              </Card>
            )}

            {paymentMethod === 'apple_pay' && (
              <Card className="p-4 bg-white border-slate-200">
                <p className="text-sm font-semibold text-slate-700">Use the Apple Pay button in Express Checkout above.</p>
              </Card>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-slate-100 rounded-2xl border border-slate-200">
              <ShieldCheck className="text-slate-600 shrink-0 mt-0.5" size={20} />
              <div className="space-y-1">
                <p className="text-[11px] text-slate-600 font-bold leading-relaxed">PCI DSS Compliant & Secure Payment</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Your payment is secured with SSL encryption.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <Button
            type="submit"
            fullWidth
            size="xl"
            isLoading={isProcessing}
            disabled={!stripe || isProcessing || (paymentMethod === 'apple_pay' && applePayAvailable)}
            className="rounded-2xl h-16 shadow-xl shadow-primary/20"
            leftIcon={!isProcessing && <Lock size={20} />}
          >
            {paymentMethod === 'paypal' ? 'Continue with PayPal' : `Pay $${total.toFixed(2)} Now`}
          </Button>
          <div className="mt-5 flex flex-col items-center gap-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Verified & Secured Payment Gateway</p>
          </div>
          <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto mt-8 mb-1" />
        </div>
      </form>
    </motion.div>
  );
}
