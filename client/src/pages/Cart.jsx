import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Handle place order
  const placeOrder = () => {
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="navbar flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">🛒 Cart</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
        >
          Go Back
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6 space-y-8">
        {/* Cart Items */}
        <section className="card bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">🛍️ Your Cart</h2>

          {cart.length === 0 ? (
            <p className="text-red-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((book, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 border p-4 rounded-lg shadow-md"
                >
                  {/* Book Image (Increased Size) */}
                  <img
                    src={book.image}
                    alt={book.name}
                    className="w-24 h-32 object-cover rounded-md"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150?text=No+Image")
                    }
                  />

                  {/* Book Info */}
                  <div className="flex-1 ml-4">
                    <strong className="text-lg font-semibold">{book.name}</strong>
                    <p className="text-gray-600 text-sm">by {book.author}</p>
                  </div>

                  {/* Remove Button (Further Decreased Size) */}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="bg-red-500 text-white px-2 py-0.5 text-xs rounded-md hover:bg-red-600 transition-all"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Order Actions */}
        {cart.length > 0 && (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={placeOrder}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all"
            >
              Place Order
            </button>
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-all"
            >
              Clear Cart
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
