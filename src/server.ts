import { PrismaClient } from '@prisma/client'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.listen({ port: 3333 }, () => {
    console.log("🔥 Server Running 🚀☕")
})