import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartState, CartItem, BeatCartItem } from '../../types/beats';
import type { ServiceCartItem } from '../../types/services';

interface CartContextType {
  cart: CartState;
  addBeatToCart: (beat: { beat_id: string; title: string; cover_path: string }, licenseType: 'lease' | 'exclusive', price: number) => void;
  addServiceToCart: (service: Omit<ServiceCartItem, 'type'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_BEAT'; payload: BeatCartItem }
  | { type: 'ADD_SERVICE'; payload: ServiceCartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_BEAT': {
      const existingIndex = state.items.findIndex(item =>
        item.type === 'beat' &&
        item.beat_id === action.payload.beat_id &&
        item.license_type === action.payload.license_type
      );

      let newItems: CartItem[];
      if (existingIndex !== -1) {
        newItems = [...state.items];
        newItems[existingIndex] = action.payload;
      } else {
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true
      };
    }

    case 'ADD_SERVICE': {
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((_, index) => index.toString() !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0, isOpen: false };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('riq-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Filter out any stale studio_session items from old cart data
        const cleanItems = (parsedCart.items || []).filter(
          (item: { type: string }) => item.type !== 'studio_session'
        ) as CartItem[];
        dispatch({
          type: 'LOAD_CART',
          payload: { ...parsedCart, items: cleanItems, total: calculateTotal(cleanItems), isOpen: false }
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('riq-cart', JSON.stringify({
      items: cart.items,
      total: cart.total,
      isOpen: false
    }));
  }, [cart.items, cart.total]);

  const addBeatToCart = (
    beat: { beat_id: string; title: string; cover_path: string },
    licenseType: 'lease' | 'exclusive',
    price: number
  ) => {
    const beatItem: BeatCartItem = {
      type: 'beat',
      beat_id: beat.beat_id,
      beat_title: beat.title,
      license_type: licenseType,
      price,
      cover_path: beat.cover_path
    };
    dispatch({ type: 'ADD_BEAT', payload: beatItem });
  };

  const addServiceToCart = (service: Omit<ServiceCartItem, 'type'>) => {
    const serviceItem: ServiceCartItem = {
      type: 'service',
      ...service
    };
    dispatch({ type: 'ADD_SERVICE', payload: serviceItem });
  };

  const removeFromCart = (itemIndex: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemIndex });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const getItemCount = () => cart.items.length;

  const value: CartContextType = {
    cart,
    addBeatToCart,
    addServiceToCart,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
