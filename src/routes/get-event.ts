import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId', {
            schema: {
                summary: 'Get event',
                tags: ['events'],
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    200: {
                        event: z.object({
                            id: z.string(),
                            title: z.string(),
                            details: z.string().nullable(),
                            slug: z.string(),
                            maximumAtttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int(),
                        })
                    }
                },
            }
        }, async (req, reply) => {
            const { eventId } = req.params

            const event = await prisma.event.findUnique({
                select: {
                    id: true,
                    title: true,
                    details: true,
                    slug: true,
                    maximumAttendees: true,
                    _count: {
                        select: {
                            attendees: true,
                        }
                    }
                },
                where: {
                    id: eventId
                }
            })
            if (!event) {
                throw new Error('Event not found.')
            }

            return reply.send({
                event: {
                    id: event.id,
                    title: event.title,
                    details: event.details,
                    slug: event.slug,
                    maximumAtttendees: event.maximumAttendees,
                    attendeesAmount: event._count.attendees,
                }
            })
        })
}