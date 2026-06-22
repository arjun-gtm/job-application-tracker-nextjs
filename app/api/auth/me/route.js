import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifySessionToken, sessionCookieName } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookieName)?.value;

    if (!token) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(token);

    if (!payload) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to load user.",
      },
      { status: 500 }
    );
  }
}
