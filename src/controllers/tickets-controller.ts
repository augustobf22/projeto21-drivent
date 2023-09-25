import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
    const ticketTypes = await ticketsService.getTicketTypes();
  
    return res.status(httpStatus.OK).send(ticketTypes);
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
    const {userId} = req;

    const userTicket = await ticketsService.getUserTicket(userId);
    return res.status(httpStatus.OK).send(userTicket);
}

export async function postUserTicket(req: AuthenticatedRequest, res: Response) {
    const {userId} = req;
    const ticketTypeId: string = req.body.ticketTypeId;

    const userTicket = await ticketsService.postTicket(userId, Number(ticketTypeId));
    return res.status(httpStatus.CREATED).send(userTicket);
}