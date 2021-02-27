import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";
import { useAuthDispatch, useAuthState } from "../context/auth";

export default function Login() {
  const { authentication } = useAuthState();
  const router = useRouter();
  if (authentication) {
    router.push("/");
  }
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});

  const dipsatch = useAuthDispatch();
  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", {
        password,
        userName,
      });
      // console.log(res.data);

      dipsatch({ type: "LOGIN", payload: res.data.user });
      router.push("/");
    } catch (error) {
      setErrors(error.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/back.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form onSubmit={submitForm}>
            <InputGroup
              type="text"
              classname="mb-2"
              placeholder="Username"
              errors={errors.userName}
              value={userName}
              setValue={setUserName}
            ></InputGroup>
            <InputGroup
              type="password"
              classname="mb-3"
              placeholder="Password"
              errors={errors.password}
              value={password}
              setValue={setPassword}
            ></InputGroup>

            <button className="w-full py-2 mb-4 text-white uppercase bg-blue-500 border-blue-500 rounded">
              Log In
            </button>
          </form>
          <small>
            New User?
            <Link href="/register">
              <a className="ml-1 font-bold text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
