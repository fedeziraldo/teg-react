import './App.css';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from './teg/Login';
import Sala from './teg/Sala';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/teg" component={Sala} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
