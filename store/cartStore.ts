// store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
  product_name: string
  price: number
  quantity: number
  pro_image: string
}

interface CartStore {
  items: CartItem[]
  totalItems: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create(
  persist<CartStore>(
    (set) => ({
      items: [],
      totalItems: 0,

      addItem: (item) => 
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              totalItems: state.totalItems + 1,
            }
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
            totalItems: state.totalItems + 1,
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          totalItems: state.totalItems - (state.items.find((i) => i.id === id)?.quantity || 0),
        })),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
        })),

      decreaseQuantity: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id)
          if (item?.quantity === 1) {
            return {
              items: state.items.filter((i) => i.id !== id),
              totalItems: state.totalItems - 1,
            }
          }
          return {
            items: state.items.map((item) =>
              item.id === id 
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
            totalItems: state.totalItems - 1,
          }
        }),

      clearCart: () => set({ items: [], totalItems: 0 })
    }),
    {
      name: 'cart-storage'
    }
  )
)