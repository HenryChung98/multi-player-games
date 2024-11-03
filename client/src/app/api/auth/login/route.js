import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  // clean up expired session data
  await cleanupExpiredSessions();

  // check user data exist
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ errors: "Invalid email" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ errors: "Invalid password" }, { status: 401 });
  }

  // if successful ------------------------------------
  // create session token
  const sessionToken = crypto.randomUUID();
  // set expire data 1 week
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // create session data
  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  // create session token to cookies
  const response = NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );
  // set session token data
  response.cookies.set({
    name: "session_token",
    value: sessionToken,
    httpOnly: true, // cannot access from client
    secure: process.env.NODE_ENV === "production", // set secure in production
    path: "/", // can access cookie from all path
    expires, // set cookie expiration
  });

  return response;
}

// clean up expired session data function
async function cleanupExpiredSessions() {
  const now = new Date();

  await prisma.session.deleteMany({
    where: {
      expires: {
        lt: now,
      },
    },
  });
}
