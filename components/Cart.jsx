import React, { useRef } from 'react'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaCcStripe } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef(null);
  const { totalPrice, totalItems, cartItems, setShowCart, toggleCartItemQuantity, removeFromCart } = useStateContext();

  const handleCheckout = async () => {
    const stripe = await getStripe();
    const res = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartItems),
    });
    if(res.statusCode === 500) return;
    const data = await res.json();
    toast.loading('Checking out...');
    stripe.redirectToCheckout({ sessionId: data.id });
  }

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button className="cart-heading" type="button" onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalItems} Items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your cart is empty</h3>
            <button className="btn" onClick={() => setShowCart(false)}>
              Continue Shopping
            </button>
          </div>
        )}
        <div className="product-container">
          {cartItems.length >= 1 && cartItems.map((item, index) => (
            <div className="product" key={index}>
              <img src={urlFor(item?.image[0])} alt={item.name} className="cart-product-image" />
              <div className="item-desc">
                <div className="flex top">
                  <h5>{item.name}</h5>
                  <h4>${item.price}</h4>
                </div>
                <div className="flex bottom">
                  <div>
                    <p className="quantity-desc">
                      <span className="minus" onClick={() => toggleCartItemQuantity(item._id, 'dec')}><AiOutlineMinus /></span>
                      <span className="num">{item.quantity}</span>
                      <span className="plus" onClick={() => toggleCartItemQuantity(item._id, 'inc')}><AiOutlinePlus /></span>
                    </p>
                  </div>
                  <button className="remove-item" type="button" onClick={() => removeFromCart(item)}>
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal: </h3>
              <h3>${totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button className="btn" type="button" onClick={handleCheckout}>
                Proceed to Buy
              </button>
              <div className="footer-container">
              <p>Powered by</p>
              <p className="icons">
                <FaCcStripe size={40} />
              </p>
              </div>
            </div>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default Cart