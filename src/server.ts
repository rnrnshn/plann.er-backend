import fastify from 'fastify'
import { prisma } from './lib/prisma'
 
// Create fastify app
const app = fastify()


// Create a route
app.get('/cadastrar', async () => {
 
  await prisma.trip.create({
    data: {
      destination: 'Maputo',
      starts_at: new Date(),
      ends_at:  new Date(),
    }
  })

  return "Registro Cadastrado com sucesso"
})

app.get('/listar', async () => {
 
  const trips = await prisma.trip.findMany()

  return trips
}) 

app.listen({port: 3333}).then(() => {
  console.log("Server running!")
})