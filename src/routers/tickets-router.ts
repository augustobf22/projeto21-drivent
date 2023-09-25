import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getUserTicket, postUserTicket } from '@/controllers';
import { createTicketValidation } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getUserTicket)
  .post('/', validateBody(createTicketValidation), postUserTicket);

export { ticketsRouter };
