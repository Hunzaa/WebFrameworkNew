const request = require('request');

//1. apiOptions
const apiOptions = { 
  server : 'http://localhost:3000' 
  }; 
  if (process.env.NODE_ENV === 'production') { 
  apiOptions.server = 'https://dashboard.heroku.com/apps/webframework'; 
  }
  
//2. requestOptions
/*const requestOptions = { 
    url : 'https://dashboard.heroku.com/apps/webframework-project-2019', 
    method : 'GET', 
    json : {}, 
    qs : { 
    offset : 20 
    } 
  };    
  request(requestOptions, (err, response, body) => { 
    if (err) { 
    console.log(err); 
    } else if (response.statusCode === 200) { 
    console.log(body); 
    } else { 
    console.log(response.statusCode); 
    } 
  });*/
  

//3. homelist
const homelist = function(req, res){
  const path = '/api/books'; 
  const requestOptions = { 
    url :apiOptions.server + path, 
    method : 'GET', 
    json : {}
  }; 
  console.log(requestOptions);

  request(
    requestOptions, 
    (err, response, body) => {
    console.log("right here");
    console.log(body); 


  _renderHomepage(req, res, body); 
  } 
  );
  };

  //5. bookInfo
/*const bookInfo = function(req, res){
  res.render('book-info', { 
    title: 'Black Butterfly',
      pageHeader: {
        title: 'Black Butterfly'
      },
      sidebar: {
        context: ': The Black Butterfly is a symbol of transformation and rebirth after death. ... This book is a collection of memories and experiences Drake lived after the death of one of his brothers. He promised he would write him a few words after he failed to complete the task while his brother was alive.',
        callToAction: 'If you\'ve read the book and you like it - or if you don\'t - please leave a review to help other people just like you.'
      },
      book: {
        name: 'Black Butterfly',
      author: 'Robert M. Drake',
        rating: 3,
        categories: ['Poetry'],
        published: '2015',	  
      
        reviews: [{
          customer: 'Melanie A',
          rating: 5,
          timestamp: 'Feb 10, 2019',
          reviewText: 'Aside from the actual content, the physical copy of this book is just beautiful. I had never seen any book designed in the way this one is. Every couple pages would be white text on black paper and different illustration done in purely black and white. So interesting and cool.'
        }, {
          customer: 'Adeeb',
          rating: 5,
          timestamp: 'Mar 15, 2018',
          reviewText: 'I’m very picky about poetry books, but this was surprisingly really well-written and relatable. I really enjoyed this and I hope to read more of his poetry collections.'
        }]
      }
    });
  };*/

  const bookInfo = function(req, res){
  _getBookInfo(req, res, (req, res, responseData) => { 
    console.log(responseData);
  _renderDetailPage(req, res, responseData); 
  }); 
};

const addReview = function(req, res){
  _getBookInfo(req, res, (req, res, responseData) => { 
  _renderReviewForm(req, res, responseData); 
}); 
}; 


const doAddReview = function(req, res){
  const bookid = req.params.bookid;
  const path = '/api/books/${bookid}/reviews';
  const postdata = {
    customer: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postdata
  };
  if (!postdata.customer || !postdata.rating || !postdata.reviewText) {
    res.redirect('/book/${bookid}/review/new?err=val');
  } else {
    request(
      requestOptions,
      (err, response, body) => {
        if (response.statusCode === 201) {
          res.redirect('/book/${bookid}');
        } else if (response.statusCode === 400 && body.name && body.name === 'ValidationError' ) {
          res.redirect('/book/${bookid}/review/new?err=val');
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};
  

const _getBookInfo = function (req, res, callback) { 
  const path = `/api/books/${req.params.bookid}`;
  const requestOptions = {
  url :apiOptions.server + path,
  method : 'GET',
  json : {}
  };
  request(requestOptions,(err, response, body) => {
  let data = body;
  if (response.statusCode === 200) {
  callback(req, res, data); 
  } else {
  _showError(req, res, response.statusCode);
  }
  }
  );
};

//4. _renderHomepage
const _renderHomepage = function(req, res, responseBody){ 
      let message = null; 
      if (!(responseBody instanceof Array)) { 
      message = "API lookup error"; 
      responseBody = []; 
      } else { 
      if (!responseBody.length) { 
      message = "No books found"; 
      } 
      }
  res.render('books-list', { 
    title: 'WEB Library - Find your favourite books!',
    pageHeader: {
      title: 'WEBLibrary',
      strapline: 'Find your favourite books!'
    },
    sidebar: "We are dedicated to improving the lives of kids and families by providing the trustworthy information of different books.",
    books: [{ 
      name: 'Black Butterfly',
      author: 'Robert M. Drake',
      rating: 3,
      categories: ['Poetry'],
      published: '2015'
      },{
      name: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      rating: 5,
      categories: ['Novel'],
      published: '1969'
      },{
      name: 'The Hunger Games',
      author: 'Suzanne Collins',
      rating: 4,
      categories: ['Fantasy','Fiction','Drama'],
      published: '1997'
      }],
      //books: responseBody,
      message: message
  });
  };


  const _renderDetailPage = function (req, res, bkDetail) { 
    res.render('book-info', { 
    title: bkDetail.name, 
    pageHeader: {
    title: bkDetail.name
        },
    sidebar: {
    context: 'is on Loc8r because  The Black Butterfly is a symbol of transformation and rebirth after death. ... This book is a collection of memories and experiences Drake lived after the death of one of his brothers. He promised he would write him a few words after he failed to complete the task while his brother was alive.',
    callToAction: 'If you\'ve read the book and you like it - or if you don\'t - please leave a review to help other people just like you.'
  },
    book: bkDetail
    });
    };
    
      
/*const _renderReviewForm = function (req, res, bkDetail ) { 
  res.render('book-review-form', {
    title: 'Review Black Butterfly on WEBLibrary',
    pageHeader: { title: 'Review Black Butterfly' }
  });
  };*/

  const _renderReviewForm = function (req, res, bkDetail) { 
    res.render('book-review-form', {
    title: 'Review ${bkDetail.name} on WEBLibrary', 
    pageHeader: { title: 'Review ${bkDetail.name}' },
    error: req.query.err
    });
    };
    

      

    
  
  




const _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const _formatPublished = function (published) {
  if (published && _isNumeric(published)) {
    let thisPublished = 0;

    if (published > 1000) {
      thisPublished = parseFloat(published).toFixed(1);
    } 
    else {
      thisPublished = Math.floor(published);
    }
    return thisPublished;
  } else {
    return '?';
  }
};

const _showError = function (req, res, status) {
  let title = '';
  let content = '';
  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.'; 
  } else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};



module.exports = {
homelist,
bookInfo,
addReview,
doAddReview
};


