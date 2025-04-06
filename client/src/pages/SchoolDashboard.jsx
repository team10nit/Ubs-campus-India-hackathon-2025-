import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SchoolDashboard() {
  const [availableBooks, setAvailableBooks] = useState([]); // Books from API
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]); // Cart State
  const [requestData, setRequestData] = useState({ title: "", author: "", category: "" }); // Form State
  const [notification, setNotification] = useState(""); // Notification state
  const navigate = useNavigate();

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/ocr/books");
        console.log("Fetched Books:", response.data);

        const books = response.data.books || []; // Ensure books exist

        // Format books for display
        const formattedBooks = books.map((book) => ({
          name: book.title,
          author: book.author || "Unknown Author",
          quantity: book.quantity || 0,
          image: book.image || "", // Include Cloudinary image URL
        }));

        setAvailableBooks(formattedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Load cart from localStorage on page load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Add book to cart and show notification
  const addToCart = (book) => {
    const updatedCart = [...cart, book];

    setCart(updatedCart); // Update state
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Store in localStorage

    // Show notification
    setNotification(`${book.name} added to cart!`);
    setTimeout(() => setNotification(""), 2000);
  };

  // Handle form input change
  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setNotification("✅ Book request submitted successfully!");
      setTimeout(() => setNotification(""), 3000);

    // try {
    //   // const response = await axios.post("http://localhost:8000/api/request-book", requestData);
    //   console.log("Book request response:", response.data);
    //   setNotification("✅ Book request submitted successfully!");
    //   setTimeout(() => setNotification(""), 3000);
    //   setRequestData({ title: "", author: "", category: "" }); // Reset form
    // } catch (error) {
    //   console.error("❌ Error submitting book request:", error);
    //   setNotification("❌ Failed to submit book request.");
    //   setTimeout(() => setNotification(""), 3000);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}

      {/* Header */}
      <header className="navbar flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">📚 School Dashboard</h1>
        <nav className="flex space-x-6">
          <a href="#available-books" className="hover:text-blue-600">
            Available Books
          </a>
          <button onClick={() => navigate("/cart")} className="relative flex items-center justify-center p-2 transition-all duration-300">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-500" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6 space-y-8">
        {/* Available Books Section */}
        <section id="available-books" className="card bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">📖 Available Books</h2>

          {loading ? (
            <p className="text-gray-700">Loading books...</p>
          ) : availableBooks.length === 0 ? (
            <p className="text-red-500">No books available.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {availableBooks.map((book, index) => (
                <li key={index} className="flex flex-col items-center bg-gray-50 border p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                  {/* Book Image */}
                  <img
                    src={book.image}
                    alt={book.name}
                    className="w-32 h-40 object-cover rounded-md"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
                  />

                  {/* Book Info */}
                  <div className="text-center mt-3">
                    <strong className="text-lg font-semibold">{book.name}</strong>
                    <p className="text-gray-600 text-sm">by {book.author}</p>
                    <p className="text-gray-500">Quantity: {book.quantity+1}</p>
                  </div>

                  {/* Add to Cart Button */}
                  <button onClick={() => addToCart(book)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all">
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Book Request Form */}
        <section className="card bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-green-600">📋 Request a Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={requestData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Author</label>
              <input
                type="text"
                name="author"
                value={requestData.author}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={requestData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Enter book category"
                required
              />
            </div>

            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all">
              Submit Request
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer p-4 bg-white text-center shadow-md">
        <p className="text-gray-600">&copy; 2025 School Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SchoolDashboard;
