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

export async function GET() {
    try {

        const applications = await prisma.applications.findMany({
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