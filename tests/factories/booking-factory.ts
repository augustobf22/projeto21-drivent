import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    select: { id: true },
    where: { userId: userId },
  });
}
