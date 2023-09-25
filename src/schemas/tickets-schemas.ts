import Joi from 'joi';
import { CreateUserTicket } from '@/protocols';

export const createTicketValidation = Joi.object<CreateUserTicket>({
    ticketTypeId: Joi.number().required()
})