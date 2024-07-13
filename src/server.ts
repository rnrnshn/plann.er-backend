import fastify from 'fastify'
import { createTrip } from './routes/create-trips'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

// Create fastify app
const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)

app.listen({ port: 3333 }).then(() => {
  console.log("Server running!")
})