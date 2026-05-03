import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: []
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("Adding:", action.payload); // 👈 DEBUG
      state.items.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.items.splice(action.payload, 1);
    }
  }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;