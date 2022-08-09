import joi from "joi";

const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password:joi.string().required(),
  userName: joi.string().required(),
  pictureUrl: joi.string().uri().required()
});

export default signUpSchema;