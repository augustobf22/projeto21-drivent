import { prisma } from '@/config';

async function findHotels(){
    const hotels = await prisma.hotel.findMany();
    return hotels;
};

async function checkHotel(userId: number){
    const check = await prisma.ticket.findFirst({
        where: {
            status: 'PAID',
            Enrollment: {
                userId: userId
            },
            TicketType: {
                isRemote: false,
                includesHotel: true
            }
        }
    })
    return check;
};

async function findHotelById(hotelId: number){
    const hotel = await prisma.hotel.findUnique({
        where: {id: hotelId},
        include: {Rooms: true}
    })
    return hotel;
};

export const hotelsRepository = { findHotels, checkHotel, findHotelById }