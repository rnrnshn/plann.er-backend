import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import nodemailer from 'nodemailer'
import { getMailClient } from "../lib/mail";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips', {
    schema: {
      body: z.object({
        destination: z.string().min(4),
        starts_at: z.coerce.date(),
        ends_at: z.coerce.date(),
        owner_name: z.string(),
        owner_email: z.string().email(),
        emails_to_invite: z.array(z.string().email())
      })
    }
  }, async (request) => {
    // save the trip data into the request body
    const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body

    // validate starts date 
    if (dayjs(starts_at).isBefore(new Date())) {
      throw new Error('Invalid trip start date.')
    }

    // validate ends date
    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new Error('Invalid trip end date.')
    }

    // create trip and add participant on the db
    const trip = await prisma.trip.create({
      data: {
        destination,
        starts_at,
        ends_at,
        participants: {
          createMany: {
            data: [
              {
                name: owner_name,
                email: owner_email,
                is_owner: true,
                is_confirmed: true,
              },
              ...emails_to_invite.map(email => {
                return { email }
              })

            ]
          }
        }
      }
    })

    // Send email to the trip creator
    const mail = await getMailClient()

    const message = await mail.sendMail({
      from: {
        name: 'Equipe plann.er',
        address: 'oi@plann.er'
      },
      to: {
        name: owner_name,
        address: owner_email,
      },
      subject: 'Testando envio de email',
      html: `<p>Teste de envio de email</p>`
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return { tripId: trip.id }
  })
}