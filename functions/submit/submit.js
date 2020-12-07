require('dotenv').config();

const mailgun = require('mailgun-js');
const Joi = require('joi');
const Handlebars = require('handlebars');

// prettier-ignore
const html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Document</title></head><body style=" font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif; min-height: 100vh; margin: 0; padding: 0; " ><h1 align="center">New Message from Website</h1><table style=" padding: 10px 20px; background-color: antiquewhite; border-radius: 10px; width: 400px; margin: 0 auto; " ><tr style="text-align: left"><th style="padding-right: 10px">Name:</th><td>{{name}}</td></tr><tr style="text-align: left"><th style="padding-right: 10px">Email:</th><td>{{email}}</td></tr><tr style="text-align: left"><th style="padding-right: 10px">Message:</th><td>{{message}}</td></tr></table><h3 style="text-align: center; margin-top: 20px">Time: {{time}}</h3></body></html>';

const template = Handlebars.compile(html);

const schema = Joi.object({
  name: Joi.string()
    .max(50)
    .required(),
  email: Joi.string()
    .max(100)
    .email()
    .required(),
  message: Joi.string()
    .max(300)
    .required(),
});

// prettier-ignore
exports.handler = (event, _, callback) => {
  const mg = mailgun({ apiKey: process.env.API_KEY, domain: process.env.DOMAIN_NAME });

  if (event.httpMethod !== 'POST' || !event.body) {
    callback(new Error('An error occurred!'));
    return;
  }

  const body = JSON.parse(event.body);
  const { value, error } = schema.validate(body);

  if (error) {
    callback(new Error(error.message));
    return;
  }

  const mailOpt = {
    from: `Web Site <${process.env.EMAIL}>`,
    to: process.env.RECEIVER,
    subject: 'New Message!',
    html: template({ ...value, time: new Date().toUTCString() }).toString(),
  };

  mg.messages().send(mailOpt, (err) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, {
      statusCode: 200,
      body: 'success',
    });
  });
};
