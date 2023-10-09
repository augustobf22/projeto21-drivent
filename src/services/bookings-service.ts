import { TicketStatus } from '@prisma/client';
import { invalidDataError, notFoundError, forbiddenError } from '@/errors';
import { bookingsRepository, enrollmentRepository, ticketsRepository } from '@/repositories';

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError();

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw forbiddenError();
  }
}

async function getBooking(userId: number) {
  const booking = await bookingsRepository.findBooking(userId);
  if (!booking || booking.id === undefined) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  await validateUserBooking(userId);

  const room = await bookingsRepository.checkRoom(roomId);
  if (!room) throw notFoundError();

  const bookingsCount = await bookingsRepository.checkAvailability(roomId);
  if (bookingsCount >= room.capacity) throw forbiddenError();

  return await bookingsRepository.createBooking(userId, roomId);
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  await validateUserBooking(userId);

  const booking = await bookingsRepository.findBooking(userId);
  if (!booking || booking.id === undefined) throw forbiddenError();

  const room = await bookingsRepository.checkRoom(roomId);
  if (!room) throw forbiddenError();

  const bookingsCount = await bookingsRepository.checkAvailability(roomId);
  if (bookingsCount >= room.capacity) throw forbiddenError();

  return await bookingsRepository.updateBooking(roomId, bookingId);
}

export const bookingsService = {
  getBooking,
  postBooking,
  putBooking,
};
