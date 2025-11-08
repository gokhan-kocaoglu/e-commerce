import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import CatalogPage from "./pages/CatalogPage";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadAnnouncement } from "./store/announcementSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const cancel = dispatch(loadAnnouncement());
    return () => {
      // thunk iptali (AbortController kullandıysan)
      if (typeof cancel === "function") cancel();
    };
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/shop" component={CatalogPage} />
          {/* Shop alt kategoriler (tek seviye) */}
          <Route path="/shop/:category" component={CatalogPage} />
          {/* 2. seviye ihtiyacı olursa ekle:
             <Route path="/shop/:category/:sub" component={CatalogPage} />
          */}
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
