const express = require('express');
const router = express.Router();
const ctrlBooks = require('../controllers/books'); 
const ctrlOthers = require('../controllers/others');

/* Books pages */
router.get('/', ctrlBooks.homelist);
router.get('/book/:bookid', ctrlBooks.bookInfo);
//router.get('/book/review/new', ctrlBooks.addReview);
router
.route('/book/:bookid/review/new')
.get(ctrlBooks.addReview)
.post(ctrlBooks.doAddReview);


/* Other pages */
router.get('/about', ctrlOthers.about);
module.exports = router;

