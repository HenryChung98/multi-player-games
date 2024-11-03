import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req) {

  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (sessionToken) {
    // delete session data
    await prisma.session.deleteMany({
      where: { sessionToken },
    });

    // delete session from cookies
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
    // delete cookies
    response.cookies.delete("session_token"); 
    return response;
  }

  return NextResponse.json({ errors: "No active session" }, { status: 401 });
}
