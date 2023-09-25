import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import { UserTicket } from '@/protocols';
import { CreateTicket } from '@/services';

async function findTypes(){
    return await prisma.ticketType.findMany();
}

async function findUserTicket(userId: number){
    return await prisma.ticket.findFirst({
        where: {Enrollment: {userId: userId}},
        include: {TicketType: true}
    })
}

async function createUserTicket(ticket: CreateTicket){
    await prisma.ticket.create({
        data: ticket
    });
}

export const ticketsRepository = { findTypes, findUserTicket, createUserTicket }