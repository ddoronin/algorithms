import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import './App.css';
import Graphs from './graphs';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Link to="/">Home</Link> {'/'} <Link to="/graphs">Graphs</Link>
        <div className="content">
          <Switch>
            <Route path="/graphs" component={Graphs} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
