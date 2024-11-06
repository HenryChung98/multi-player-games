import Link from "next/link";

export default function UserList({ user, onlineUsers, displayOnlineUserBar }) {
  return (
    <>
      <div
        className={`md:block bg-[#09133b] rounded ${
          !displayOnlineUserBar && "hidden"
        }`}
      >
        <div className={`p-4 flex flex-col h-full`}>
          <h3 className="font-bold mb-2">Users</h3>
          <ul className="space-y-1 p-2 min-w-[100px]">
            {onlineUsers.map((nickname) => (
              <li
                key={nickname}
                className={`${
                  nickname === user?.nickname ? "text-blue-500 font-bold" : ""
                }`}
              >
                {nickname}
              </li>
            ))}
          </ul>
          <Link
            href="/"
            className="mt-auto mb-1 bg-red-400 text-center p-2 rounded hover:bg-red-300"
          >
            Exit
          </Link>
        </div>
      </div>
    </>
  );
}
