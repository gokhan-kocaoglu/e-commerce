import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import CatalogPage from "./pages/CatalogPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountProfile from "./pages/AccountProfile";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutPaymentPage from "./pages/CheckoutPaymentPage";
import AccountOrders from "./pages/AccountOrders";
import AccountOrderDetailPage from "./pages/AccountOrderDetailPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadAnnouncement } from "./store/announcementSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const cancel = dispatch(loadAnnouncement());
    return () => {
      // thunk iptali (AbortController kullandığın zaman)
      if (typeof cancel === "function") cancel();
    };
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/shop" component={CatalogPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/account/profile" component={AccountProfile} />
          <Route exact path="/account/orders" component={AccountOrders} />
          <Route
            path="/account/orders/:orderId"
            component={AccountOrderDetailPage}
          />
          {/* Shop alt kategoriler (tek seviye) */}
          <Route path="/shop/:category" component={CatalogPage} />
          {/* 2. seviye ihtiyacı olursa:
             <Route path="/shop/:category/:sub" component={CatalogPage} />
          */}
          <Route
            path="/product/:categorySlug/:productSlug"
            component={ProductDetails}
          />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route path="/checkout/payment" component={CheckoutPaymentPage} />
          <Route path="/about" component={About} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/team" component={Team} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
