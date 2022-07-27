// https://petstore3.swagger.io
const petstore_backend = "petstore";

import { OpenAPIValidator } from 'openapi-backend/validation';
import { OpenAPIRouter } from 'openapi-backend/router';

const openapi_document = require("./petstore.json");

const openapi_router = new OpenAPIRouter({
  definition: openapi_document,
  apiRoot: '/api/v3',
  ignoreTrailingSlashes: true,
});

const openapi_validator = new OpenAPIValidator({
  definition: openapi_document,
  lazyCompileValidators: false,
  router: openapi_router,
});

// validates HTTP requests against the spec defined in the OpenAPI validator object.
async function openapi_request_validation(req) {
  try {
    const openapi_checking_req = new Request(req);

    let method = openapi_checking_req.method
    let url = new URL(openapi_checking_req.url);
    let headers = Object.fromEntries(openapi_checking_req.headers.entries());
    let query = Object.fromEntries(url.searchParams.entries());
    let body = await openapi_checking_req.text();

    let valid = openapi_validator.validateRequest(
      {
        method: method,
        path: url.pathname,
        headers: headers,
        query: query,
        body: body,
      }
    );

    if (valid.valid) {
      console.log("request_valid: true");
      return valid
    };
    if (!valid.valid) {
      console.log("request_valid: false", JSON.stringify(valid.errors,null,2));
      return valid
    };
  } catch (error) {
    console.log(error);
    console.log("validation error")
    return error
  }
}

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  
  let original_req = event.request;

  let original_headers = new Headers();
  for (let pair of original_req.headers.entries()) {
    original_headers.append(pair[0], pair[1]);
  };
 
  const original_req_init = {
    method: original_req.method,
    headers: original_headers
  };
  
  if (original_req.body) {
    original_req_init.body = await original_req.text();
  };

  let req = new Request(original_req.url, original_req_init);
  let openapi_check_req = new Request(original_req.url, original_req_init);  

  let validation_result = await openapi_request_validation(openapi_check_req);

  if (validation_result.errors) {
    const headers = new Headers();
    headers.set('Content-Type', 'text/html');
    return new Response('<h2>Validation Error</h2>' + JSON.stringify(validation_result.errors, null, 2), {
      status: 400,
      headers,
      url: original_req.url
    })
  }

  req.headers.set("host", "petstore3.swagger.io");
  return fetch(req, {
    backend: petstore_backend
  });
}
