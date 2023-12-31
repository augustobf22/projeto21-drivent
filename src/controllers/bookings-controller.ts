import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingsService } from '@/services';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingsService.getBooking(userId);
  res.status(httpStatus.OK).send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);

  const booking = await bookingsService.postBooking(userId, roomId);

  res.status(httpStatus.OK).send({ bookingId: booking.id });
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);
  const bookingId = Number(req.params.bookingId);

  const booking = await bookingsService.putBooking(userId, roomId, bookingId);

  res.status(httpStatus.OK).send({ bookingId: booking.id });
}
