import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'
import { createLogger } from '../utils/logger';
import { APIGatewayProxyEvent } from "aws-lambda";

const logger = createLogger('auth/utils');

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  logger.info("Parsing user id from jwt token")
  const decodedJwt = decode(jwtToken) as JwtPayload

  logger.info(`Parsing user id: ${decodedJwt.sub}`)
  return decodedJwt.sub
}

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}