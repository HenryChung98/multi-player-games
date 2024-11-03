import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const sessionToken = req.cookies.get("session_token")?.value;
  if (!sessionToken) {
    return NextResponse.json({ errors: "Not authenticated" }, { status: 401 });
  }
  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: sessionToken },
      include: { user: true },
    });
    if (!session) {
      return NextResponse.json(
        { errors: "Session not found" },
        { status: 401 }
      );
    }
    // await prisma.session.deleteMany({});

    if (!session || new Date() > new Date(session.expires)) {
      return NextResponse.json({ errors: "Session expired" }, { status: 401 });
    }

    return NextResponse.json({ user: session.user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user session:", error);

    return NextResponse.json(
      { errors: "Internal server error" },
      { status: 500 }
    );
  }
}
