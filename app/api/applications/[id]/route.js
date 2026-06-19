import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
    try {

        const { id } = await params

        const application = await prisma.application.findUnique({
            where: {
                id: id
            }
        })

        if (!application) {
            return Response.json({
                success: false,
                message: "Application not found."
            },
                { status: 404 }
            )
        }

        return Response.json({
            success: true,
            data: application
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to fetch application."
        },
            { status: 500 }
        )
    }
}

export async function PATCH(request, { params }) {
    try {

        const { id } = await params

        const body = await request.json()

        const data = {}

        if (body.companyName !== undefined) {
            data.companyName = body.companyName
        }

        if (body.jobTitle !== undefined) {
            data.jobTitle = body.jobTitle
        }

        if (body.jobType !== undefined) {
            data.jobType = body.jobType
        }

        if (body.status !== undefined) {
            data.status = body.status
        }

        if (body.appliedDate !== undefined) {
            data.appliedDate = new Date(body.appliedDate)
        }

        if (body.notes !== undefined) {
            data.notes = body.notes
        }

        const existing = await prisma.application.findUnique({
            where: {
                id: id
            }
        })

        if (!existing) {
            return Response.json({
                success: false,
                message: "Application not found."
            },
                { status: 404 }
            )
        }

        const application = await prisma.application.update({
            where: {
                id: id
            },
            data: data
        })

        return Response.json({
            success: true,
            data: application
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to update application."
        },
            { status: 500 }
        )
    }
}

export async function DELETE(request, { params }) {
    try {

        const { id } = await params

        const existing = await prisma.application.findUnique({
            where: {
                id: id
            }
        })

        if (!existing) {
            return Response.json({
                success: false,
                message: "Application not found."
            },
                { status: 404 }
            )
        }

        await prisma.application.delete({
            where: {
                id: id
            }
        })

        return Response.json({
            success: true,
            message: "Application deleted."
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to delete application."
        },
            { status: 500 }
        )
    }
}
