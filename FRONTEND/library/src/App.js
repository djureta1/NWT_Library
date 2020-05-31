import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Login from "./Login/Login"
import Admin from './Admin/Admin';
import Book from './Book/Book'
import { Profile } from "./Profile/index"
import { Role } from "./Role/index"
import { Employee } from "./Employee/index"
import Member from './Member/Member'
import Copy from './Copy/Copy'
import Stuff from './Paneli/Stuff'
import AdminPage from './Paneli/AdminPage'
import Author from './Author/Author'
import Genre from './Genre/Genre'
import BookType from './BookType/BookType'
import Publisher from './Publisher/Publisher'


function App() {
  return (
    <div>
      <Router>
        <Route path="/stuff" exact component={Stuff} />
        <Route path="/stuff/copy" component={Copy} />
        <Route path="/stuff/author" component={Author} />
        <Route path="/stuff/genre" component={Genre} />
        <Route path="/stuff/booktype" component={BookType} />
        <Route path="/stuff/publisher" component={Publisher} />
        <Route path="/adminpage" component={AdminPage} />
        <Route path="/" exact component={Login} />
        <Route path="/admin" component={Admin} />
        <Route path="/books" component={Book} />
        <Route path="/profiles" component={Profile} />
        <Route path="/roles" component={Role} />
        <Route path="/employees" component={Employee} />
        <Route path="/member" component={Member} />
      </Router>
    </div>
  );
}

export default App;
