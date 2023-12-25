import React, { useEffect, useState } from "react";
import HomeLayout from "@/components/layouts/HomeLayout";
import { type Cart } from "@/interfaces/Cart.type";

type Props = {};

export default function CartPage({}: Props) {
  const [Cart, setCart] = useState<Cart[]>([]);

  function getCart() {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCart(JSON.parse(cart));
    }

    return [];
  }

  useEffect(() => {
    getCart();
  }, []);

  return (
    <HomeLayout titile="ตะกร้าสินค้า">
      <h1>dawdawd</h1>
      {JSON.stringify(Cart)}
    </HomeLayout>
  );
}
