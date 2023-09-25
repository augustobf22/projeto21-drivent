import { Ticket, TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories';
import { UserTicket } from '@/protocols';
import { TicketNotFoundError, TicketCreateBodyError } from '@/errors';
import { enrollmentRepository } from '@/repositories';

async function getTicketTypes(): Promise<TicketType[]> {
    return await ticketsRepository.findTypes();
}

async function getUserTicket(userId: number): Promise<UserTicket> {
    const result = await ticketsRepository.findUserTicket(userId);

    if(result === null || !result.id || !result.enrollmentId) throw TicketNotFoundError;

    return result;
}

export type CreateTicket = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>

async function postTicket(userId: number, ticketTypeId: number): Promise<UserTicket>{
    const enrollmentIdQuery = await enrollmentRepository.findWithAddressByUserId(userId);
    const enrollmentId: number = enrollmentIdQuery ? enrollmentIdQuery.id : null;

    if(enrollmentId === null) throw TicketNotFoundError;
    if(!ticketTypeId) throw TicketCreateBodyError;

    const ticket: CreateTicket = {
        ticketTypeId: ticketTypeId,
        enrollmentId: enrollmentId,
        status: 'RESERVED'
    };

    await ticketsRepository.createUserTicket(ticket);

    const result = getUserTicket(userId);
    return result;
}

export const ticketsService = { getTicketTypes, getUserTicket, postTicket }