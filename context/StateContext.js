import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const increaseQuantities = () => {
    setTotalQuantities((prevQuantity) => prevQuantity + 1);
  }

  const decreaseQuantities = () => {
    setTotalQuantities((prevQuantity) => {
      if (prevQuantity - 1 < 1) return 1;
      return prevQuantity - 1
    });
  }

  const addToCart = (product, quantity) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
    setTotalItems((prevTotalItems) => prevTotalItems + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) return {
          ...cartProduct,
          quantity: cartProduct.quantity + quantity
        }
        return cartProduct;
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${totalQuantities} ${product.name}s added to cart!`);
  }

  const toggleCartItemQuantity = (id, value) => {
    if (value === "inc") {
      const newCartItems = cartItems.map((product) => {
        if (product._id === id) {
          setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price);
          setTotalItems((prevTotalItems) => prevTotalItems + 1);
          product.quantity += 1;
        }
        return product;
      });
      setCartItems(newCartItems);
    } else if (value === "dec") {
      const newCartItems = cartItems.map((product) => {
        if (product._id === id && product.quantity > 1) {
          setTotalPrice((prevTotalPrice) => prevTotalPrice - product.price);
          setTotalItems((prevTotalItems) => prevTotalItems - 1);
          product.quantity -= 1;
        }
        return product;
      });
      setCartItems(newCartItems);
    }
  };

  const removeFromCart = (product) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice((prevTotalPrice) => prevTotalPrice -foundProduct.price * foundProduct.quantity);
    setTotalItems(prevTotalItems => prevTotalItems - foundProduct.quantity);
    setCartItems(newCartItems);
  }

  return (
    <Context.Provider value={{ showCart, setCartItems, setTotalPrice, setTotalItems, cartItems, totalItems, totalPrice, totalQuantities, increaseQuantities, decreaseQuantities, addToCart, setShowCart, toggleCartItemQuantity, removeFromCart }}>
      {children}
    </Context.Provider>
  )
};

export const useStateContext = () => {
  return useContext(Context);
}