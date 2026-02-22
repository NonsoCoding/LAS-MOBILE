import { create } from "zustand";

interface Order {
  id: string;
  pickUp: string;
  destination: string;
  status: "pending" | "in-transit" | "completed" | "cancelled";
  customer: any;
}

interface OrderState {
  newOrders: Order[];
  activeOrder: Order | null;
  orderHistory: Order[];

  setNewOrders: (orders: Order[]) => void;
  acceptOrder: (order: Order) => void;
  updateOrderStatus: (status: Order["status"]) => void;
  completeOrder: () => void;
}

const userOrderStore = create<OrderState>((set) => ({
  newOrders: [],
  activeOrder: null,
  orderHistory: [],

  setNewOrders: (orders) => set({ newOrders: orders }),
  acceptOrder: (order) =>
    set({
      activeOrder: order,
      newOrders: [],
    }),

  updateOrderStatus: (status) =>
    set((state) =>
      state.activeOrder
        ? {
            activeOrder: {
              ...state.activeOrder,
              status,
            },
          }
        : state
    ),
  completeOrder: () =>
    set((state) => ({
      orderHistory: state.activeOrder
        ? [...state.orderHistory, state.activeOrder]
        : state.orderHistory,
      activeOrder: null,
    })),
}));

export default userOrderStore;
