
'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { CulturalItem } from 'fire/src/types';
import { useToast } from "fire/src/hooks/use-toast"

interface LikedItemsContextType {
  likedItems: CulturalItem[];
  addLikedItem: (item: CulturalItem) => void;
  removeLikedItem: (itemId: string) => void;
  isLiked: (itemId: string) => boolean;
}

const LikedItemsContext = createContext<LikedItemsContextType | undefined>(undefined);

export const LikedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [likedItems, setLikedItems] = useState<CulturalItem[]>([]);
  const [lastAction, setLastAction] = useState<{ type: 'add' | 'remove'; item: CulturalItem } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (lastAction) {
      if (lastAction.type === 'add') {
        toast({ title: `Added "${lastAction.item.name}" to your liked list.` });
      } else {
        toast({ title: `Removed "${lastAction.item.name}" from your liked list.` });
      }
      setLastAction(null); // Reset after showing toast
    }
  }, [likedItems, toast, lastAction]);


  const addLikedItem = useCallback((item: CulturalItem) => {
    setLikedItems((prevItems) => {
      if (prevItems.some(i => i.id === item.id)) {
        return prevItems;
      }
      setLastAction({ type: 'add', item });
      return [...prevItems, item];
    });
  }, []);

  const removeLikedItem = useCallback((itemId: string) => {
    setLikedItems((prevItems) => {
      const itemToRemove = prevItems.find(i => i.id === itemId);
      if (itemToRemove) {
        setLastAction({ type: 'remove', item: itemToRemove });
      }
      return prevItems.filter((item) => item.id !== itemId);
    });
  }, []);

  const isLiked = useCallback((itemId: string) => {
    return likedItems.some((item) => item.id === itemId);
  }, [likedItems]);

  return (
    <LikedItemsContext.Provider value={{ likedItems, addLikedItem, removeLikedItem, isLiked }}>
      {children}
    </LikedItemsContext.Provider>
  );
};

export const useLikedItems = () => {
  const context = useContext(LikedItemsContext);
  if (context === undefined) {
    throw new Error('useLikedItems must be used within a LikedItemsProvider');
  }
  return context;
};
