import joi from "joi";

const likedPostsSchema = joi.object({
  postId: joi.number().required()

});

export default likedPostsSchema;