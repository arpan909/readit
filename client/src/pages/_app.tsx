import { AppProps } from "next/app";
import axios from "axios";

import "../styles/tailwind.css";
import NavBar from "../components/navBar";
import { useRouter } from "next/router";
import { AuthProvider } from "../context/auth";
import { SWRConfig } from "swr";

axios.defaults.baseURL = "http://localhost:5004/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(router.pathname);
  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <AuthProvider>
        {!isAuthRoute && <NavBar />}
        <div className={isAuthRoute ? "" : "pt-12"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
