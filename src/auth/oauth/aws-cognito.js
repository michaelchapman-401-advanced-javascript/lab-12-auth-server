'use strict';

const superagent = require('superagent');
const Users = require('../users-model.js');
const base64 = require('base-64');


let cognitoOptions = {
  response_type: 'code',
  client_id: '2d0k796nrue6e0sobheavhe5nv',
  redirect_uri: 'http://localhost:3000/oauth',
  state: 'state',
}

let queryStringGernerator = () => {
  let AUTH_DOMAIN_URL = 'https://lab-12-auth-server.auth.us-east-2.amazoncognito.com/oauth2/authorize';

  let QueryString = Object.keys(cognitoOptions).map((key, i) => {
    return `${key}=` + encodeURIComponent(cognitoOptions[key]);
  }).join("&");

  let authURL = `${AUTH_DOMAIN_URL}?${QueryString}`;

  return authURL;
};

let authorize = (request) => {
  console.log('HELLO');
  console.log('(1)', request.query);

  let AUTH_DOMAIN = queryStringGernerator();  
  let basicAuthHeader = `${process.env.AWS_CLIENT_ID}:${process.env.AWS_CLIENT_SECRET}`;
  // pull in encode library for base 64 and encode basic auth header
  basicAuthHeader = base64.encode(basicAuthHeader);

  let authURL = `${AUTH_DOMAIN}/oauth2/token`;

  return superagent.post(authURL)
    .type('form')
    .set('Authorization', `Basic${basicAuthHeader}`)
    .send({
      grant_type: 'authorization_code',
      code: request.query.code,
      client_id: process.env.AWS_CLIENT_ID,
      redirect_uri: `http://localhost:3000/oauth`,
    })
    .then(result => {
      console.log('(2): ', result);
    })
    .catch(error => error );

}

module.exports = authorize;
