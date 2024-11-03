"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const InputField = ({ label, type, value, onChange, error400, error409 }) => {
  return (
    <>
      <div className="m-5">
        <label>{label}</label>
        <input
          className="text-blue-500"
          type={type}
          value={value}
          onChange={onChange}
        />

        <span className={`text-red-500 ${error400 ? "" : "hidden"}`}>
          {error400}
        </span>
        <span className={`text-red-500 ${error409 ? "" : "hidden"}`}>
          {error409}
        </span>
      </div>
    </>
  );
};

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error400, setError400] = useState([]);
  const [error409, setError409] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError400([]); // reset errors
    setError409([]);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, nickname, password, confirmPassword }),
    });

    const data = await res.json(); // get data from api

    // when get 201 status
    if (res.ok) {
      console.log(`success ${JSON.stringify(data)}`);
      router.push("/auth/login");
    }
    // if error happens
    else {
      // check 400 error first
      if (res.status === 400) {
        setError400(data.errors);
      }
      // then check 409 error
      else if (res.status === 409) {
        setError409(data.errors);
      }
    }
  };
  return (
    <>
      <h1 className="text-2xl">Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error400={error400.includes("email") ? "email is required" : ""}
          error409={error409.includes("email") ? "email already exists" : ""}
        />
        <InputField
          label="Nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error400={error400.includes("nickname") ? "nickname is required" : ""}
          error409={
            error409.includes("nickname") ? "nickname already exists" : ""
          }
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error400={error400.includes("password") ? "password is required" : ""}
        />
        <InputField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error400={
            error400.includes("confirmPassword")
              ? "Password does not match"
              : ""
          }
        />
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}
