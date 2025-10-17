import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* TÜM UYGULAMA İÇİN GENİŞLİK SINIRI */}
      <div className="mx-auto w-full max-w-4/5">
        <Switch>
          <Route exact path="/" component={Home} />
          {/* diğer rotalar */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
