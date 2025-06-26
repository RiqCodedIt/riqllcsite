import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CartState, CartItem, BeatCartItem, StudioCartItem } from '../../types/beats';
import type { ServiceCartItem } from '../../types/services';

interface CartContextType {
  cart: CartState;
  addBeatToCart: (beat: { beat_id: string; title: string; cover_path: string }, licenseType: 'lease' | 'exclusive', price: number) => void;
  addStudioSessionToCart: (session: Omit<StudioCartItem, 'type'>) => void;
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
  | { type: 'ADD_STUDIO_SESSION'; payload: StudioCartItem }
  | { type: 'ADD_SERVICE'; payload: ServiceCartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const generateItemId = (item: CartItem): string => {
  if (item.type === 'beat') {
    return `${item.beat_id}_${item.license_type}`;
  } else if (item.type === 'studio_session') {
    return `studio_${item.session_id}`;
  } else {
    return `service_${item.service_id}`;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_BEAT': {
      // Check if this exact beat license combo already exists
      const existingIndex = state.items.findIndex(item => 
        item.type === 'beat' && 
        item.beat_id === action.payload.beat_id && 
        item.license_type === action.payload.license_type
      );

      let newItems: CartItem[];
      if (existingIndex !== -1) {
        // Replace existing item (user might want to update license type)
        newItems = [...state.items];
        newItems[existingIndex] = action.payload;
      } else {
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true // Auto-open cart when item is added
      };
    }

    case 'ADD_STUDIO_SESSION': {
      const newItems = [...state.items, action.payload];
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
      return {
        items: [],
        total: 0,
        isOpen: false
      };

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

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('riq-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { ...parsedCart, isOpen: false } });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('riq-cart', JSON.stringify({
      items: cart.items,
      total: cart.total,
      isOpen: false // Don't persist open state
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

  const addStudioSessionToCart = (session: Omit<StudioCartItem, 'type'>) => {
    const studioItem: StudioCartItem = {
      type: 'studio_session',
      ...session
    };
    dispatch({ type: 'ADD_STUDIO_SESSION', payload: studioItem });
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

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getItemCount = () => {
    return cart.items.length;
  };

  const value: CartContextType = {
    cart,
    addBeatToCart,
    addStudioSessionToCart,
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
