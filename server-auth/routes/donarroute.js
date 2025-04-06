const express = require('express');
const { registerDonor, loginDonor, getDonors, getDonorById } = require('../controllers/donarController');

const router = express.Router();

router.post('/donors/register', registerDonor);
router.post('/donors/login',loginDonor)
router.get('/donors/get-all',getDonors)
router.get('/donors/:donorId', getDonorById);
module.exports = router;
