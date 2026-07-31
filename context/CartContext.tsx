// src/context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export interface CartItem {
  gearItemId: string;
  name: string;
  pricePerDay: number;
  quantity: number;
  stock: number;
  providerId: string;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  isInitialized: boolean;
  totalCartItems: number; // 👈 Added to interface
  addToCart: (item: CartItem) => void;
  updateQuantity: (gearItemId: string, quantity: number) => void;
  removeFromCart: (gearItemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rental_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart, isInitialized]);

  // 👈 Calculate total count of all quantities dynamically
  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Rule: Single provider per order restriction
      if (prevCart.length > 0 && prevCart[0].providerId !== newItem.providerId) {
        throw new Error(
          "You can only rent items from one provider per order."
        );
      }

      const existingIndex = prevCart.findIndex(
        (item) => item.gearItemId === newItem.gearItemId
      );

      if (existingIndex > -1) {
        const target = prevCart[existingIndex];
        const newQty = target.quantity + newItem.quantity;

        if (newQty > target.stock) {
          throw new Error(`Cannot add more than available stock (${target.stock}).`);
        }

        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = { ...target, quantity: newQty };
        return updatedCart;
      }

      if (newItem.quantity > newItem.stock) {
        throw new Error(`Cannot add more than available stock (${newItem.stock}).`);
      }

      return [...prevCart, newItem];
    });
  };

  const updateQuantity = (gearItemId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.gearItemId === gearItemId) {
          const clampedQty = Math.min(Math.max(1, quantity), item.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (gearItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.gearItemId !== gearItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isInitialized,
        totalCartItems, // 👈 Exported to provider consumers
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};