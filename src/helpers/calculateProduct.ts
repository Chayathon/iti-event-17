import { type Cart } from "@/interfaces/Cart.type";

export function calculateSubtotal(cart: Cart[]) {
  let subtotal = 0.0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  return subtotal;
}

export function calculateTotal(cart: Cart[], Shipping: number) {
  let total = 0.0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  total += Shipping;

  return total;
}
