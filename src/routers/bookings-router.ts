import { Router } from 'express';
import { authenticateToken, validateBooking } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers';
import { bookingSchema } from '@/schemas/booking-schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBooking(bookingSchema), postBooking)
  .put('/:bookingId', validateBooking(bookingSchema), putBooking);

export { bookingsRouter };
