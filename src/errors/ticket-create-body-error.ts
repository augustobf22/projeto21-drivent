import { ApplicationError } from '@/protocols';

export function TicketCreateBodyError(): ApplicationError {
  return {
    name: 'TicketCreateBodyError',
    message: 'Body was not sent.',
  };
}
