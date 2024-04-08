import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'

async function seed() {
    await prisma.event.deleteMany()
    await prisma.attendee.deleteMany()

    await prisma.event.create({
        data: {
            id: 'ad34a061-2e35-4b99-a5aa-a8e778f04d73',
            title: 'Unite Summit',
            slug: 'unite-summit',
            details: 'Um evento p/ devs apaixonados(as) por código!',
            maximumAttendees: 120,
        }
    })

    await Promise.all(Array.from({ length: 112 }).map(async (_) => {
        await prisma.attendee.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email().toLocaleLowerCase(),
                eventId: "ad34a061-2e35-4b99-a5aa-a8e778f04d73"
            }
        })
    }))
}

seed().then(() => {
    console.log('🌱 Seeding complete!')
})