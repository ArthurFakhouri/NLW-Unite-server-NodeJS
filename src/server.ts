import { PrismaClient } from '@prisma/client'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

const app = fastify()

const prisma = new PrismaClient({
    log: ['query']
})

app.post('/events', async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
    })
    const eventData = createEventSchema.parse(req.body)

    const event = await prisma.event.create({
        data: {
            title: eventData.title,
            details: eventData.details,
            maximumAttendees: eventData.maximumAttendees,
            slug: new Date().toISOString(),
        }
    })

    return reply.status(201).send({ eventId: event.id })
})

app.listen({ port: 3333 }, () => {
    console.log("🔥 Server Running 🚀☕")
})