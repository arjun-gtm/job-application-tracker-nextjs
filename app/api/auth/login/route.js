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
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    cookieStore.set(sessionCookieName, token, sessionCookieOptions);

    return Response.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to log in.",
      },
      { status: 500 }
    );
  }
}
