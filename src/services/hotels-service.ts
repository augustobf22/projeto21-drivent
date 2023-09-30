import { hotelsRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { notFoundError, paymentRequiredError} from '@/errors';

async function getHotels(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const hotels = await hotelsRepository.findHotels();
    if(hotels.length === 0) throw notFoundError();

    const checkHotel = await hotelsRepository.checkHotel(userId);
    if(!checkHotel) throw paymentRequiredError();

    return hotels;
};

async function getHotelById(userId: number, hotelId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const hotels = await hotelsRepository.findHotels();
    if(hotels.length === 0) throw notFoundError();

    const checkHotel = await hotelsRepository.checkHotel(userId);
    if(!checkHotel) throw paymentRequiredError();

    const hotelById = await hotelsRepository.findHotelById(hotelId);
    return hotelById;
};

export const hotelsService = { getHotels, getHotelById };