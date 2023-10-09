import { ApplicationError } from '@/protocols';

export function TicketNotFoundError(): ApplicationError {
  return {
    name: 'TicketNotFoundError',
    message: 'User has no tickets.',
  };
}
