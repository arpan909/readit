import axios from "axios";
import Link from "next/link";
import React, { Fragment } from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";

import Logo from "../images/logo.svg";

export default function NavBar() {
  const { authentication, loading } = useAuthState();
  const dispatch = useAuthDispatch();
  const logout = async () => {
    try {
      await axios.get("/auth/logout/");
      dispatch({ type: "LOGOUT" });
      window.location.reload();
    } catch (errors) {
      console.log(errors);
    }
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Logo className="w-6 h-6 mr-1" />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">readit</Link>
        </span>
      </div>

      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white focus-within:border-blue-500 focus-within:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none "
        ></input>
      </div>

      <div className="flex">
        {!loading &&
          (authentication ? (
            <button
              className="w-32 py-2 mr-2 button blue hollow"
              onClick={logout}
            >
              log out
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="w-32 py-2 mr-2 button blue hollow">log in</a>
              </Link>
              <Link href="/register">
                <a className="w-32 py-2 button blue">sign up</a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  );
}
