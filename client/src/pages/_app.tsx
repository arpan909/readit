import { AppProps } from "next/app";
import axios from "axios";

import "../styles/tailwind.css";
import NavBar from "../components/navBar";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/auth";

axios.defaults.baseURL = "http://localhost:5004/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoutes = ["/login", "/register"];
  const isValid = authRoutes.includes(router.pathname);
  return (
    <AuthProvider>
      {!isValid && <NavBar />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default App;
