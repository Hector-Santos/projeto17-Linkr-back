export function validate(req, res, next, schema) {
    const body = req.body;
        const validation = schema.validate(body, {abortEarly: false});
        if (validation.error) {
          return res.status(422).send(validation.error);
        }

    next();
  }