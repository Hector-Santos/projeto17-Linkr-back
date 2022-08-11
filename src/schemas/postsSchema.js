import joi from "joi";

const postsSchema = joi.object({
  content: joi.string().required()
});

export default postsSchema;