import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { addBook, fetchBook, selectIsLoadingViaAPI } from "../../redux/slices/booksSlice";
import createBookWithID from "../../utils/createBookWithID";
import booksData from "../../data/books.json";
import "./BookForm.css";
import { setError } from "../../redux/slices/errorSlice";

const BookForm = () => {
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const isLoadingViaAPI = useSelector(selectIsLoadingViaAPI);
   const dispatch = useDispatch();

   const handleSubmit = (e) => {
      e.preventDefault();

      if (title && author) {
         dispatch(addBook(createBookWithID({ title, author }, "manual")));
         setTitle("");
         setAuthor("");
      } else {
         dispatch(setError({ msg: "You must fill title and author!", type: "info" }));
      }
   };

   const handleAddRandomBook = () => {
      const rundomIndex = Math.floor(Math.random() * booksData.length);
      const randomBook = booksData[rundomIndex];
      dispatch(addBook(createBookWithID(randomBook, "random")));
   };

   const handleAddRandomBookViaAPI = () => {
      dispatch(fetchBook("http://localhost:4000/random-book-delayed"));
   };

   return (
      <div className="app-block book-form">
         <h2>Add new book</h2>

         <form onSubmit={handleSubmit}>
            <div>
               <label htmlFor="title">Title</label>
               <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
            </div>

            <div>
               <label htmlFor="author">Author</label>
               <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
               />
            </div>

            <button type="submit">Add Book</button>
         </form>

         <button type="button" onClick={handleAddRandomBook}>
            Add random book
         </button>
         <button type="button" onClick={handleAddRandomBookViaAPI} disabled={isLoadingViaAPI}>
            {isLoadingViaAPI ? (
               <>
                  <span>Loading book...</span>
                  <FaSpinner className="spinner" />
               </>
            ) : (
               "Add random via API"
            )}
         </button>
      </div>
   );
};

export default BookForm;
