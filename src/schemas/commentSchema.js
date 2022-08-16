import joi from "joi";

const commentSchema = joi.object({
  content: joi.string().required()
});

export default commentSchema;