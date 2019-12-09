const mongoose = require('mongoose');
const Bk = mongoose.model('Book');

//1. reviewsCreate
const reviewsCreate = function (req, res) {
	constbookid = req.params.bookid;
	if (bookid) {
		Bk
		.findById(bookid)
		.select('reviews')
		.exec((err, book) => {
		if (err) {
		res
		.status(400)
		.json(err);
		} else {
		_doAddReview(req, res, book); 
		}
		}
		);
		} else {
		res
		.status(404)
		.json({"message": "Not found, bookid required"
	});
}
};

//2. reviewsReadOne	
const reviewsReadOne = function (req, res) {res
  if (req.params && req.params.bookid && req.params.reviewid) {
    Bk
      .findById(req.params.bookid)
      .exec((err, book) => {
        if (!book) {
          res	
            .status(404) 
            .json({	
              "message": "bookid not found"
            });	 
          return;
        } else if (err) {
          res	
            .status(404) 
            .json(err); 
          return; 	
        }
        if (book.reviews && book.reviews.length > 0) {
          const review = book.reviews.id(req.params.reviewid);
          if (!review) {
            res
              .status(404)
              .json({
                "message": "reviewid not found"
            });
          } else {
            response = {
              book : {
                name : book.name,
                id : req.params.bookid
              },
              review : review
            };
            res
              .status(200)
              .json(response);
          }
        } else {
          res
            .status(404)
            .json({
              "message": "No reviews found"
          });
        } 
      });
  } else {		
    res		
      .status(404) 	
      .json({	
        "message": "Not found, bookid and reviewid are both required"
      });		
  }
};

//3. reviewsUpdateOne 
const reviewsUpdateOne = function (req, res) {res
  if (!req.params.bookid || !req.params.reviewid) {
  res
        .status(404)
        .json({
          "message": "Not found, bookid and reviewid are both required"
        });
  return;
    }
  Bk
      .findById(req.params.bookid)
      .select('reviews')
      .exec((err, book) => {
  if (!book) {
  res
            .status(404)
            .json({
              "message": "bookid not found"
            });
  return;
        } else if (err) {
  res
            .status(400)
            .json(err);
  return;
        }
  if (book.reviews&&book.reviews.length> 0) {
  letthisReview = book.reviews.id(req.params.reviewid);
  if (!thisReview) {
  res
              .status(404)
              .json({
                "message": "reviewid not found"
              });
          } else {
  thisReview.customer = req.body.customer;
  thisReview.rating = req.body.rating;
  thisReview.reviewText = req.body.reviewText;
  book.save((err, book) => {
  if (err) {
  res
                  .status(404)
                  .json(err);
              } else {
                _updateAverageRating(book._id);
  res
                  .status(200)
                  .json(thisReview);
              }
            });
          }
        } else {
  res
            .status(404)
  json({
              "message": "No review to update"
            });
        }
      }
    );
  };
  
   
   
  //4. reviewsDeleteOne
  const reviewsDeleteOne = function (req, res) {res
    if (!req.params.bookid || !req.params.reviewid) {
    res
        .status(404)
        .json({
        "message": "Not found, bookid and reviewid are both required"
        });
    return;
      }
    Bk
      .findById(req.params.bookid)
      .select('reviews')
      .exec((err, book) => {
    if (!book) {
    res
          .status(404)
          .json({
          "message": "bookid not found"
          });
    return;
        } else if (err) {
    res
          .status(400)
          .json(err);
    return;
        }
    if (book.reviews&&book.reviews.length> 0) {
    if (!book.reviews.id(req.params.reviewid)) {
    res
          .status(404)
          .json({
            "message": "reviewid not found"
          });
        } else {
    book.reviews.id(req.params.reviewid).remove();
    book.save((err) => {
    if (err) {
    res
            .status(404)
            .json(err);
          } else {
    updateAverageRating(book._id);
    res
            .status(204)
            .json(null);
          }
          });
        }
        } else {
    res
          .status(404)
          .json({
          "message": "No review to delete"
          });
        }
      }
      );
    };
  


//5. _doAddReview
const _doAddReview = function(req, res, book) {
if (!book) {
res
      .status(404)
      .json({
        "message": "bookid not found"
      });
  } else {
book.reviews.push({
customer: req.body.customer,
rating: req.body.rating,
reviewText: req.body.reviewText
    });
book.save((err, book) => {
  if (err) {
  console.log(err);
        res
          .status(400)
          .json(err);
      } else {
        _updateAverageRating(book._id);
letthisReview = book.reviews[book.reviews.length - 1];
res
           .status(201)
           .json(thisReview);
      }
    });
  }
};


//6. _updateAverageRating
const _updateAverageRating = function(bookid) {
Bk
    .findById(bookid)
    .select('rating reviews')
    .exec((err, book) => {
if (!err) {
doSetAverageRating(book); 
      }
    });
};


//7. _doSetAverageRating
const _doSetAverageRating = function(book) {
	if (book.reviews&&book.reviews.length> 0) {
		constreviewCount = book.reviews.length;
		letratingTotal = 0;
		for (let i = 0; i<reviewCount; i++) {
		ratingTotal = ratingTotal + book.reviews[i].rating;
			}
		letratingAverage = parseInt(ratingTotal / reviewCount, 10);
		book.rating = ratingAverage;
		book.save((err) => {
		if (err) {
		console.log(err);
			  } else {
		console.log("Average rating updated to", ratingAverage);
			  }
			});
	}
};







module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};
