import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Pricing from "./components/Pricing";
function App() {
  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path="/success">
            <div>Success</div>
          </Route>
          <Route path="/cancel">
            <div>Cancel</div>
          </Route>
          <Route path="/">
            <Pricing />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
