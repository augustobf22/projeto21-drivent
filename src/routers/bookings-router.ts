import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers';
import { validateBody } from '@/middlewares';
import { bookingSchema } from '@/schemas/booking-schemas';

const bookingsRouter = Router();

bookingsRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody(bookingSchema), postBooking)
    .put('/:bookingId', validateBody(bookingSchema), putBooking)

export { bookingsRouter };