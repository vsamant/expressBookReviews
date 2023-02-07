const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
      if (!username) {
        return res.status(404).json({message: "Unable to register user. Username not provided."});
      } 
      if (!password) {
        return res.status(404).json({message: "Unable to register user. Password not provided."});
      }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn_book = books[req.params.isbn];
  res.send(JSON.stringify(isbn_book));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let isbns = Object.keys(books);
  let author_book;
  for (var j=0; j<isbns.length;j++) {
      var isbn = isbns[j];
      if(books[isbn].author === req.params.author) {
          author_book = books[isbn];
          break;
      }
  }
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(author_book))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let isbns = Object.keys(books);
  let title_book;
  for (var j=0; j<isbns.length;j++) {
      var isbn = isbns[j];
      if(books[isbn].title === req.params.title) {
          title_book = books[isbn];
          break;
      }
  }
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(title_book))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn_book = books[req.params.isbn];
  res.send(JSON.stringify(isbn_book.reviews));
});

module.exports.general = public_users;
