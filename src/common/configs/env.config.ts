import * as Joi from 'joi';
import { registerAs } from '@nestjs/config';

const database = registerAs('database', () => ({
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  name: process.env.MONGO_DB_NAME,
  password: process.env.MONGO_PASSWORD,
}));

export default {
  envFilePath: `.${process.env.NODE_ENV}.env`,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_PORT: Joi.string().required(),
    MONGO_HOST: Joi.string().required(),
    MONGO_USER: Joi.string().required(),
    MONGO_DB_NAME: Joi.string().required(),
  }),
  load: [database],
  isGlobal: true,
};
