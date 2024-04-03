import { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"

export async function createEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/events', {
        schema: {
            summary: 'Create an event',
            tags: ['events'],
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
            throw new BadRequest("Event with same title already exists")
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