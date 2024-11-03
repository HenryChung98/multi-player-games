"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
// to get user data
import { useUser } from "@/app/context/UserContext";
// components
import LogoutForm from "./auth/logout/page";

export default function Home() {
  // to get user data
  const { user, loading } = useUser();

  if (loading) {
    return <div>loading</div>;
  }

  // formatter
  const dateFormatter = (date) => {

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const createdAt = new Date(date);
    const createdYear = createdAt.getFullYear(); 
    const createdMonth = createdAt.getMonth() + 1; 
    const createdDate = createdAt.getDate();
    const createdDayIndex = createdAt.getDay(); 

    return `${dayNames[createdDayIndex]}, ${monthNames[createdMonth - 1]} ${createdDate}, ${createdYear}`;
  }
 
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl">Home Page</h1>
      <main className="p-3 border border-red-200 flex flex-col gap-8 items-center sm:items-start">
        {user ? (
          <>
            <div className="user-info border border-red-200 p-3">Name: {user.nickname}
              <p>{user.email}</p>
              <p>Signed up on {dateFormatter(user.createdAt)}</p>
            </div>
           
            <LogoutForm />
            <Link href="/dashboard">Go to Dashboard</Link>
            <Link href="/chatroom">Start Chat</Link>
            <Link href="/drawingGameRoom">Start Draw</Link>
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <Link href="/auth/login">Login</Link>
          </>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
