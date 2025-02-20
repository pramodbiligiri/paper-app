import {PaperList} from './PaperList';
import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

const App = (props) => {

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
      return <p>Loading...</p>;
    }

    return (
      <Router>
        <Switch>
          <Route path='/' exact={true}   render={(props) => ( <PaperList /> )} />
        </Switch>
      </Router>
    );
}

export {App};
