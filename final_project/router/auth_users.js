const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password, username: username
      }, 'access', { expiresIn: 60 *60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn_book = books[req.params.isbn];
  let reviews = isbn_book.reviews;

  reviews[req.user.username] = req.body.review;

  res.send("Review by " + JSON.stringify(req.user.username) + " has been added to isbn " + req.params.isbn);
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn_book = books[req.params.isbn];
    let reviews = isbn_book.reviews;

    delete reviews[req.user.username];

    res.send("Review from " + req.user.username + " deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
