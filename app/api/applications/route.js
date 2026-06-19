import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {

        const body = await request.json()

        const { companyName, jobTitle, jobType, status, appliedDate } = body

        if (!companyName || !jobTitle || !jobType || !status || !appliedDate) {
            return Response.json({
                success: false,
                message: "Missing required fields."
            },
                { status: 400 }
            )
        }

        const application = await prisma.application.create({
            data: {
                companyName: companyName,
                jobTitle: jobTitle,
                jobType: jobType,
                status: status,
                appliedDate: new Date(appliedDate)
            }
        })

        return Response.json({
            success: true,
            data: application
        },
            { status: 201 }
        )

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to create application."
        },
            { status: 500 }
        )
    }
}

export async function GET(request) {
    try {

        const { searchParams } = new URL(request.url)
        const status = searchParams.get("status")
        const search = searchParams.get("search")

        const where = {}

        if (status) {
            where.status = status
        }

        if (search) {
            where.OR = [
                {
                    companyName: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    jobTitle: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        }

        const applications = await prisma.application.findMany({
            where: where,
            orderBy: {
                createdAt: "desc"
            }
        })

        return Response.json({
            success: true,
            data: applications
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to fetch applications."
        },
            { status: 500 }
        )
    }
}