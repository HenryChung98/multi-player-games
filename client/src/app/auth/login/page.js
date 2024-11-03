"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const InputField = ({ label, type, value, onChange }) => {
  return (
    <>
      <div className="m-5">
        <label>{label}</label>
        <input
          className="text-blue-500"
          type={type}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </>
  );
};

export default function Login() {
  const searchParams = useSearchParams();
  // add redirect query
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error401, setError401] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError401(""); // reset errors

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json(); // get data from api

    if (res.ok) {
      // if redirect query exists, redirect to the page
      window.location.href = redirectTo || "/";
    } else {
      setError401(data.errors);
    }
  };

  return (
    <>
      <h1 className="text-2xl">Login Page</h1>
      <p className={`text-red-500 ${error401 ? "" : "hidden"}`}>{error401}</p>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <Link href="/auth/signup">signup</Link>
    </>
  );
}
