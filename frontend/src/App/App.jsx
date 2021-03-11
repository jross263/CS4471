import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { history } from "../_helpers";
import { alertActions } from "../_actions";
import { SiteNavbar, PrivateRoute } from "../_components";
import { HomePage } from "../HomePage";
import { LoginPage } from "../LoginPage";
import { RegisterPage } from "../RegisterPage";
import { AdminPage } from "../AdminPage";
import { ServicesPage } from "../ServicesPage";
import { SubscriptionsPage } from "../SubscriptionsPage";

function App() {
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(alertActions.clear());
    });
  }, []);

  return (
    <Router history={history}>
      <SiteNavbar>
        <div className="col-md-8 offset-md-2">
          {alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )}
        </div>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute
            exact
            path="/subscriptions"
            component={SubscriptionsPage}
          />
          <PrivateRoute exact path="/services" component={ServicesPage} />
          <PrivateRoute exact path="/admin" component={AdminPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Redirect to="/" />
        </Switch>
      </SiteNavbar>
    </Router>
  );
}

export { App };
