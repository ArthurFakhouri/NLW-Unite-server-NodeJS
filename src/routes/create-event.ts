import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/events', {
        schema: {
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximumAttendees: z.number().int().positive().nullable()
            }),
            response: {
                201: z.object({
                    eventId: z.string().uuid()
                }),
                400: z.object({
                    message: z.string()
                })
            }
        }
    }, async (
        req,
        reply
    ) => {
        const eventData = req.body

        const slug = generateSlug(eventData.title)

        const eventWithSameSlug = await prisma.event.findUnique({
            where: {
                slug
            }
        })

        if (eventWithSameSlug) {
            return reply.status(400).send({ message: "Event already exists" })
        }

        const event = await prisma.event.create({
            data: {
                title: eventData.title,
                details: eventData.details,
                maximumAttendees: eventData.maximumAttendees,
                slug,
            }
        })

        return reply.status(201).send({ eventId: event.id })
    })
}