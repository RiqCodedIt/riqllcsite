import { loadStripe } from '@stripe/stripe-js';
import type { CartItem } from '../types/beats';

const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const API_URL = import.meta.env.REACT_APP_API_URL;

export interface CheckoutData {
  items: CartItem[];
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export const createCheckoutSession = async (checkoutData: CheckoutData): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    
    if (data.url) {
      return data.url;
    } else {
      throw new Error(data.error || 'Failed to create checkout session');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const redirectToCheckout = async (checkoutData: CheckoutData): Promise<void> => {
  try {
    const checkoutUrl = await createCheckoutSession(checkoutData);
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

export { stripePromise };
