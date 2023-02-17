# compute-openapi-validator
Compute@Edge service that performs API request and response validation based on OpenAPI/Swagger schema

## Usage
 1. `npm install`
 2. `fastly compute build`
 3. Test your code by building and running the package locally with `fastly compute serve`
 4. Update `service_id` in the *fastly.toml* file with your C@E service id
 5. When ready to compile and deploy your code to Fastly, run `fastly compute publish`
