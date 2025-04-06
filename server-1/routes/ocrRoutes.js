import express from 'express';
import { getAllBooks, getBooksByCategory, processImage, remainingDetails } from '../controllers/ocrController.js';
import upload from '../../server-5/middleware/multer.js';
const router = express.Router();

router.post('/process',upload.single("image"),processImage);
router.post('/remaining',remainingDetails)
router.get('/books', getAllBooks);
router.get('/books/category/:category', getBooksByCategory); // Add category search route


export default router;