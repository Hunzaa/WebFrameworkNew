const mongoose = require('mongoose');
const Bk = mongoose.model('Book');

//1. _buildBookList
const _buildBookList = function(req, res, results, stats) {
  let books = [];
  results.forEach((doc) => {
    books.push({
      name: doc.obj.name,
      author: doc.obj.author,
      rating: doc.obj.rating,
      categories: doc.obj.categories,
      published: doc.obj.published,
      _id: doc.obj._id
    });
  });
  return books;
};

//2. booksListByPublished
const booksListByPublished = function (req, res) {
  //Bk.find( (err, results, stats) => {
    const books = _buildBookList(req, res, results, stats);
    //console.log('Book results', results);
    //console.log('Book stats', stats); 
  res
  .status(200)
  .json(books);
 // });
};


//3. booksCreate
const booksCreate = function (req, res) {
Bk.create({ 
name: req.body.name,
author: req.body.author,
rating: req.body.rating,
categories: req.body.categories.split(","), 
published: req.body.published, 
}, (err, book) => { 
if (err) {
res
.status(400)
.json(err);
} else {
res
.status(201)
.json(book);
}
});
};

//4. booksReadOne
const booksReadOne = function(req, res) {
 if (req.params && req.params.bookid) {
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
        res		
          .status(200)
          .json(book);
      });
  } else {		
    res		
      .status(404) 	
      .json({	
        "message": "No bookid in request"
      });		
  }
};


//5. booksUpdateOne
const booksUpdateOne = function (req, res) { res
	if (!req.params.bookid) {
	res
		  .status(404)
		  .json({
			"message": "Not found, bookid is required"
		  });
	return;
	  }
	Bk
		.findById(req.params.bookid)
		.select('-reviews -rating')
		.exec((err, book) => {
	if (!book) {
	res
			  .json(404)
			  .status({
				"message": "bookid not found"
			  });
	return;
		  } else if (err) {
	res
			  .status(400)
			  .json(err);
	return;
		  }
	book.name = req.body.name;
  book.author = req.body.author;
  book.rating = req.body.rating;
	book.categories	= req.body.categories.split(",");
	book.published = req.body.published;
	book.save((err, book) => {
	if (err) {
	res
				.status(404)
				.json(err);
			} else {
	res
				.status(200)
				.json(book);
			}
		  });
		}
	  );
	};



//6. booksDeleteOne
const booksDeleteOne = function (req, res) {res
const bookid = req.params.bookid;
if (bookid) {
Bk
      .findByIdAndRemove(bookid) 
      .exec((err, book) => {
if (err) {
res
              .status(404)
              .json(err);
return;
          }
res
            .status(204)
            .json(null);
        }
    );
  } else {
res
      .status(404)
      .json({
        "message": "No bookid"
      });
  }
};




module.exports = {
  booksListByPublished,
  booksCreate,
  booksReadOne,
  booksUpdateOne,
  booksDeleteOne
};
