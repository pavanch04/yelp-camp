let BaseJoi = require("joi");
let sanitizeHtml = require("sanitize-html");


const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
      escapeHTML: {
          validate(value, helpers) {
              const clean = sanitizeHtml(value, {
                  allowedTags: [],
                  allowedAttributes: {},
              });
              if (clean !== value) return helpers.error('string.escapeHTML', { value })
              return clean;
          }
      }
  }
});

let joi = BaseJoi.extend(extension)

module.exports.cgSchema = joi.object({
  campground: joi.object({
    title: joi.string().required().escapeHTML(),
    price: joi.number().required().min(0),
    description: joi.string().required().escapeHTML(),
    location: joi.string().required().escapeHTML(),
  }).required(),
  deleteImages : joi.array()
});

module.exports.revSchema = joi.object({
  reviews: joi.object({
    body: joi.string().required().escapeHTML(),
    rating: joi.number().required().min(1).max(5)
  }).required()
})
