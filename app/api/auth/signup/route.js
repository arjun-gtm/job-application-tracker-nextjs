import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existing) {
      return Response.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email: email,
        password: hashedPassword,
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, token, sessionCookieOptions);

    return Response.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to create account.",
      },
      { status: 500 }
    );
  }
}
