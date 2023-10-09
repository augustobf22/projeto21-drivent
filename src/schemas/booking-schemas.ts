import Joi from 'joi';

type CreateBookingParams = { roomId: number };

export const bookingSchema = Joi.object<CreateBookingParams>({
  roomId: Joi.number().required(),
});
