import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req) {
  const body = await req.json();
  const { email, nickname, password, confirmPassword } = body;
  const error400 = [];
  const error409 = [];

  try {
    if (!email) {
      error400.push("email");
    }
    if (!nickname) {
      error400.push("nickname");
    }
    if (!password) {
      error400.push("password");
    } else if (password != confirmPassword) {
      error400.push("confirmPassword");
    }

    // if at least one required field is empty, return bad request
    if (error400.length > 0) {
      return NextResponse.json({ errors: error400 }, { status: 400 });
    }

    const existingUser = await prisma.user.findMany({
      where: {
        OR: [{ email }, { nickname }],
      },
    });

    if (existingUser.length > 0) {
      existingUser.forEach((user) => {
        if (user.email === email) {
          error409.push("email");
        }
        if (user.nickname === nickname) {
          error409.push("nickname");
        }
      });
    }

    // if there is at least one error, return conflict
    if (error409.length > 0) {
      return NextResponse.json({ errors: error409 }, { status: 409 });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });

    // return created request
    return NextResponse.json({ message: "success", user }, { status: 201 });
  } catch (error) {
    // return server error
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  } finally {
    // to prevent memory leak
    await prisma.$disconnect();
  }
}
