import React from 'react'
import { Redirect, Route, Switch, BrowserRouter as Router } from "react-router-dom"
import Homepage from './pages/Homepage/Homepage'
import Forgepage from "./pages/Forgepage/Forgepage";


export default function Routes() {

  return (
    <Router>
      <Switch>
        <Route path='/forge'>
          <Forgepage />
        </Route>
        <Route path="/home">
          <Homepage />
        </Route>
        <Redirect to='/home' />
      </Switch>
    </Router>
  )
}