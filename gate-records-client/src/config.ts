// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'pl102hj1e9'
export const apiEndpoint = `https://${apiId}.execute-api.ap-south-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-rr6wtngq.us.auth0.com',            // Auth0 domain
  clientId: 'bFHfM9qinbb35fMvAHIN4sSnTefMMOYc',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
