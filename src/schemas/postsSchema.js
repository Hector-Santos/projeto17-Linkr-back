import joi from "joi";

const postsSchema = joi.object({
  content: joi.string().required(),
  link: joi.string().uri().required()

});

export default postsSchema;