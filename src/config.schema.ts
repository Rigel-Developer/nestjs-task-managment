import * as Joi from '@hapi/joi';

//This is important si tienes problmas con tus variables de entorno, por si no se envia alguna que este mapeado
//en esta seccion la consola de indicara
export const configValidationSchema = Joi.object({
    STAGE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5000).required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
});
