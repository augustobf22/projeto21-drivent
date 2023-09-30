import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { createEnrollmentWithAddress, createTicket, createTicketTypeInfo, createUser, createHotel, createRoom} from '../factories';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await generateValidToken();
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
      
        it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 when there are no hotels', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should return 402 if its remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(true, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createHotel();

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should return 402 if doesnt include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should return 402 if its not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        })

        it('should return 200 and hotel data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([{
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString()
            }]);
        });
    });
})

describe('GET /hotels/:id', () => {
    it('should respond with status 401 if no token is given', async () => {
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
            const token = await generateValidToken();
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
      
        it('should respond with status 404 when user doesnt have a ticket yet', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 when there are no hotels', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should return 402 if its remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(true, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should return 402 if doesnt include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, false);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should return 402 if its not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        })

        it('should return 200 and hotel data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeInfo(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel();
            const room = await createRoom(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
                Rooms: 
                    [
                        {
                            id: room.id,
                            name: room.name,
                            capacity: room.capacity,
                            hotelId: room.hotelId,
                            createdAt: room.createdAt.toISOString(),
                            updatedAt: room.updatedAt.toISOString(),
                        }
                    ]
            });
        });
    });
})