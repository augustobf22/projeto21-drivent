import { prisma } from '@/config';

async function findHotels(){
    const hotels = await prisma.hotel.findMany();
    // convert date 
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
                includesHotel: true
            }
        }
    })
    return check;
};

async function findHotelById(hotelId: number){
    const hotels = await prisma.hotel.findUnique({
        where: {id: hotelId},
        include: {Rooms: true}
    })
};

export const hotelsRepository = { findHotels, checkHotel, findHotelById }