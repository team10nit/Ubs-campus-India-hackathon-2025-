import { extractTextFromImage } from '../services/ocrService.js';
import { extractBookInfoFromText } from '../services/geminiService.js';
import { uploadToCloudinary } from "../utils/cloudinary.js";
import sharp from "sharp";
import Book from '../models/BookModel.js';
// import { sendEmail } from "../utils/email.js";
// import { loadTemplate } from "../utils/templateLoader.js"; 

export const processImage = async (req, res) => {
  const { donor_id, condition, quantity, grade_level, language, category } = req.body;

  try {
    console.log("📥 Incoming Body:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Proof of delivery is required" });
    }

    // Optimize Image
    const optimizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

    // Upload to Cloudinary
    const cloudResponse = await uploadToCloudinary(fileUri);
    const imageUrl = cloudResponse.secure_url;

    // OCR and Book Data Extraction
    const text = await extractTextFromImage(imageUrl);
    let bookData = await extractBookInfoFromText(text);

    if (bookData && typeof bookData === 'string') {
      // Clean and Parse JSON Response
      const cleaned = bookData
        .replace(/```json|```/gi, '')  // Remove markdown JSON formatting
        .trim();

      try {
        bookData = JSON.parse(cleaned);
      } catch (err) {
        console.error("❌ JSON parse error:", err);
        return res.status(500).json({ error: "Failed to parse Gemini response." });
      }
    } else {
      console.warn("⚠ Gemini response was empty or malformed:", bookData);
      return res.status(500).json({ error: "Invalid response from Gemini service." });
    }

    console.log('📚 The book title is:', bookData.title);
      const donor_id='67ee79079536fbabc33bea5c'
    // Save Book to Database
    const newBook = new Book({
      // donor_id,
      title: bookData.title,
      // condition,
      // quantity,
      // grade_level,
      // language,
      // category: bookData.genre || category, // Fallback to user-provided category
      image: imageUrl,
      author:bookData.author
    });

    await newBook.save();

    console.log('new book is',newBook)
    res.json({ success: true, newBook});

  } catch (err) {
    console.error("❌ OCR Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const remainingDetails=async(req,res)=>{
  const { donor_id, condition, quantity, grade_level, language, category,id } = req.body;
  try{

    const existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).json({ error: "Book not found. Please upload the book image first." });
    }

    existingBook.donor_id = donor_id || existingBook.donor_id;
    existingBook.condition = condition || existingBook.condition;
    existingBook.quantity = quantity || existingBook.quantity;
    existingBook.grade_level = grade_level || existingBook.grade_level;
    existingBook.language = language || existingBook.language;
    existingBook.category = category || existingBook.category;

    await existingBook.save();

    res.json({ success: true, message: "Book details updated successfully", book: existingBook });

  }
  catch(err){
    console.error("❌ OCR Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
}

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error("❌ Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const getBooksByDonor = async (req, res) => {
  try {
    const { donor_id } = req.params;

    if (!donor_id) {
      return res.status(400).json({ error: "Donor ID is required" });
    }

    const books = await Book.find({ donor_id });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found for this donor." });
    }

    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error("❌ Error fetching donor's books:", error);
    res.status(500).json({ error: "Failed to fetch books for the donor" });
  }
};

// export const requestBookAdmin = async (req, res) => {
//   try {
//     const { school_id, title, author, category } = req.body;
//     const admin_email = "abhi3.02638@gmail.com"; // Replace with actual admin email

//     if (!school_id || !title || !author || !category) {
//       return res.status(400).json({ error: "All fields (school_id, title, author, category) are required" });
//     }

//     // Load the correct email template
//     const htmlTemplate = loadTemplate("requestBookTemplate.hbs", {
//       title: "New Book Request",
//       school_id,
//       book_title: title,
//       author,
//       category,
//       message: "A new book request has been submitted.",
//     });

//     console.log("📤 Sending book request email to admin:", admin_email);

//     // Send email to admin
//     await sendEmail({
//       email: admin_email.trim(),
//       subject: "New Book Request from School",
//       html: htmlTemplate,
//     });

//     res.status(200).json({ success: true, message: "Book request sent to admin via email" });
//   } catch (error) {
//     console.error("❌ Error sending book request email:", error);
//     res.status(500).json({ error: "Failed to send book request email" });
//   }
// };


export const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const books = await Book.find({ category: { $regex: new RegExp(category, "i") } });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found in this category." });
    }

    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error("❌ Error fetching books by category:", error);
    res.status(500).json({ error: "Failed to fetch books by category" });
  }
};
