import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LazyLoading from "./components/Loading/LazyLoading";
import { isLoggedIn } from "./services/auth";
import Navbar from "./components/Navbar/MainNavbar";
import Error from "./components/ErrorPage/Error";
import { ErrorBoundary } from "react-error-boundary";

const LazyTempSignUp = React.lazy(() => import("./components/SignUp/SignUp"));
const LazyTempSignIn = React.lazy(() => import("./components/SignIn/SignIn"));
const LazyDashboard = React.lazy(() =>
  import("./components/Dashboard/Dashboard")
);
const LazySlots = React.lazy(() => import("./components/Slots/Slots"));
const LazyCheckout = React.lazy(() => import("./components/Checkout/Checkout"));

function ProtectRoute({ children }) {
  const auth = isLoggedIn();
  return auth ? children : <Navigate to="/" />;
}

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/signup"
            element={
              <React.Suspense fallback={<LazyLoading />}>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                  <LazyTempSignUp />
                </ErrorBoundary>
              </React.Suspense>
            }
          />

          <Route
            path="/"
            element={
              <React.Suspense fallback={<LazyLoading />}>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                  <LazyTempSignIn />
                </ErrorBoundary>
              </React.Suspense>
            }
          />

          <Route
            path="/dashboard"
            element={
              <React.Suspense fallback={<LazyLoading />}>
                <ProtectRoute>
                  <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <LazyDashboard />
                  </ErrorBoundary>
                </ProtectRoute>
              </React.Suspense>
            }
          />

          <Route
            path="/slots"
            element={
              <React.Suspense fallback={<LazyLoading />}>
                <ProtectRoute>
                  <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <LazySlots />
                  </ErrorBoundary>
                </ProtectRoute>
              </React.Suspense>
            }
          />

          <Route
            path="/checkout/:id/:from/:to"
            element={
              <React.Suspense fallback={<LazyLoading />}>
                <ProtectRoute>
                  <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <LazyCheckout />
                  </ErrorBoundary>
                </ProtectRoute>
              </React.Suspense>
            }
          />

          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
