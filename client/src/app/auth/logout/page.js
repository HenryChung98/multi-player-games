"use client";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
  const router = useRouter();

  const handleLogout = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      window.location.reload();
      router.push("/");
    } else {
      console.error(data.errors);
    }
  };

  return (
    <form onSubmit={handleLogout}>
      <button type="submit">Logout</button>
    </form>
  );
}
