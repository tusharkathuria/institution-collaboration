import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import middyCors from "@middy/cors"

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(middyCors({
    credentials: true,
    origin: "*",
    headers: "*"
  }))
}
