import Joi from 'joi';
import { COORDINATES, EVENT_NAME_LENGTH } from '../consts/validation';

const createSchema = Joi.object().keys({
  name: Joi.string().required().min(EVENT_NAME_LENGTH.min).max(EVENT_NAME_LENGTH.max),
  description: Joi.string().required(),
  price: Joi.number().positive().required(), // if price == 0 ticket is free
  ticketsLimit: Joi.number().positive().required(), // can it be unlimited?
  isNotificationsOn: Joi.boolean().required(),
  isPublic: Joi.boolean().required(),
  date: Joi.date().iso().min('now').required(),
  publishDate: Joi.date().iso().min('now').less(Joi.ref('date')).required(),
  latitude: Joi.number().required().min(COORDINATES.min).max(COORDINATES.max),
  longitude: Joi.number().required().min(COORDINATES.min).max(COORDINATES.max),
  formatId: Joi.number().positive().required(),
  themeId: Joi.number().positive().required(),
});

const updateSchema = Joi.object().keys({
  name: Joi.string().required().min(EVENT_NAME_LENGTH.min).max(EVENT_NAME_LENGTH.max),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  ticketsLimit: Joi.number().positive().required(),
  isNotificationsOn: Joi.boolean().required(),
  isPublic: Joi.boolean().required(),
  date: Joi.date().iso().min('now').required(),
  publishDate: Joi.date().iso().less(Joi.ref('date')).required(),
  latitude: Joi.number().required().min(COORDINATES.min).max(COORDINATES.max),
  longitude: Joi.number().required().min(COORDINATES.min).max(COORDINATES.max),
  formatId: Joi.number().positive().required(),
  themeId: Joi.number().positive().required(),
});

const ticketSchema = Joi.object().keys({
  isVisible: Joi.boolean().default(true),
});

export { createSchema, updateSchema, ticketSchema };
