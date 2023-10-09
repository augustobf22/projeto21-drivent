import { prisma } from '@/config';

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    select: {id: true, Room: true},
    where: {userId: userId}
  })
};

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
};

async function checkRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {id: roomId}
  });
};

async function checkAvailability(roomId: number) {
  return prisma.booking.count({
    where: {roomId}
  });
};

async function updateBooking(userId: number, roomId: number) {
  return prisma.booking.update({
    data: {roomId},
    where: {userId}
  });
};

export const bookingsRepository = {
  findBooking,
  createBooking,
  updateBooking,
  checkRoom,
  checkAvailability
};
