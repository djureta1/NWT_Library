import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Login from "./Login/Login"
import Admin from './Admin/Admin';
import Book from './Book/Book'


function App() {
  return (
    <div>
      <Router>
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        <Route path="/books" component={Book} />
      </Router>
    </div>
  );
}

export default App;
