import { AppProps } from "next/app";
import axios from "axios";

import "../styles/tailwind.css";
import { Fragment } from "react";
import NavBar from "../components/navBar";
import { useRouter } from "next/router";

axios.defaults.baseURL = "http://localhost:5001/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoutes = ["/login", "/register"];
  const isValid = authRoutes.includes(router.pathname);
  return (
    <Fragment>
      {!isValid && <NavBar />}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default App;
