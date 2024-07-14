import fastify from 'fastify'
import { createTrip } from './routes/create-trips'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { confirmTrip } from './routes/confirm-trip';
import cors from '@fastify/cors'

// Create fastify app
const app = fastify()

app.register(cors, {
  origin: '*', // allow all origins
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running!")
})