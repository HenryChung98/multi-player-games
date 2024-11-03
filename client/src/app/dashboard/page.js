"use client";
// to get user data
import { useUser } from "@/app/context/UserContext";

export default function Dashboard() {
  // to get user data
  const { user, loading } = useUser();
  if (loading) {
    return <div>loading</div>;
  }
  return (
    <>
      <div>dashboard page</div>
      {user ? <div>{user.nickname}</div> : <div>not logged in</div>}
    </>
  );
}
