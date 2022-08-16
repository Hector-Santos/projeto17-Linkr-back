import joi from "joi";

const postsSchema = joi.object({
  content: joi.string().required(),
  link: joi.string().uri().required(),
  hashtags: joi.array().required()
});

const editSchema = joi.object({
  content: joi.string().required()
});

export {
  postsSchema,
  editSchema
};