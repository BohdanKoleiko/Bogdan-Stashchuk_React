import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createBookWithID from "../../utils/createBookWithID";
import { setError } from "./errorSlice";

const initialState = {
   books: [],
   isLoadingViaAPI: false,
};

export const fetchBook = createAsyncThunk("books/fetchBook", async (url, thunkAPI) => {
   try {
      const res = await axios.get(url);
      return res.data;
   } catch (error) {
      thunkAPI.dispatch(setError({ msg: error.message, type: "error" }));
      // OPTION 1
      return thunkAPI.rejectWithValue(error);

      //// OPTION 2
      //throw error;
   }
});

const booksSlice = createSlice({
   name: "books",
   initialState,
   reducers: {
      addBook: (state, action) => {
         return { ...state, books: [...state.books, action.payload] };
      },
      deleteBook: (state, action) => {
         return { ...state, books: state.books.filter((book) => book.id !== action.payload) };
      },
      toggleFavorite: (state, action) => {
         return state.books.map((book) =>
            book.id === action.payload ? { ...book, isFavorite: !book.isFavorite } : book,
         );
      },
   },
   // OPTION 1
   extraReducers: {
      [fetchBook.pending]: (state) => {
         //state.isLoadingViaAPI = true; // if I want to use Immer library
         return { ...state, isLoadingViaAPI: true };
      },
      [fetchBook.fulfilled]: (state, action) => {
         state = { ...state, isLoadingViaAPI: false };
         if (action.payload?.title && action.payload?.author) {
            return { ...state, books: [...state.books, createBookWithID(action.payload, "API")] };
         }
      },
      [fetchBook.rejected]: (state) => {
         //state.isLoadingViaAPI = false; // if I want to use Immer library
         return { ...state, isLoadingViaAPI: false };
      },
   },
   //// OPTION 2
   //extraReducers: (builder) => {
   //   builder.addCase(fetchBook.pending, (state) => {
   //      return { ...state, isLoadingViaAPI: true };
   //   });
   //   builder.addCase(fetchBook.fulfilled, (state, action) => {
   //      state = { ...state, isLoadingViaAPI: false };
   //      //state.books.push(action.payload); // allowed variant glad to Immer extension
   //      if (action.payload?.title && action.payload?.author) {
   //         return { ...state, books: [...state.books, createBookWithID(action.payload, "API")] }; // I prefer to use classic variant without mutation
   //      }
   //   });
   //   builder.addCase(fetchBook.rejected, (state) => {
   //      return { ...state, isLoadingViaAPI: false };
   //   });
   //},
});

export const { addBook, deleteBook, toggleFavorite } = booksSlice.actions;

//export const thunkFunction = async (dispatch, getState) => {
//   try {
//      const res = await axios.get("http://localhost:4000/random-book");
//      if (res?.data?.title && res?.data?.author) {
//         dispatch(addBook(createBookWithID(res.data, "API")));
//      }
//   } catch (error) {
//      console.log("Error fetching random book", error);
//   }
//};

export const selectBooks = (state) => state.books.books;
export const selectIsLoadingViaAPI = (state) => state.books.isLoadingViaAPI;

export default booksSlice.reducer;
