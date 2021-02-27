import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import InputGroup from "../components/InputGroup";
import { useAuthDispatch, useAuthState } from "../context/auth";

export default function Register() {
  const { authentication } = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  if (authentication) {
    router.push("/");
  }
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [agreement, setAgreement] = useState(false);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    if (!agreement) {
      setErrors((prevErrors: Object[]) => ({
        ...prevErrors,
        agreement: "You must agree to the T&Cs!",
      }));
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        email,
        password,
        userName,
      });
      dispatch({ type: "LOGIN", payload: res.data });

      router.push("/login");
    } catch (error) {
      setErrors(error.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
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
            <div className="mb-6">
              <input
                type="checkbox"
                id="agreement"
                className="mr-1 cursor-pointer"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get email about readit stuff.
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              type="email"
              classname="mb-2"
              placeholder="Email"
              errors={errors.email}
              value={email}
              setValue={setEmail}
            ></InputGroup>
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
              Sign Up
            </button>
          </form>
          <small>
            Already a user?
            <Link href="/login">
              <a className="ml-1 font-bold text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
