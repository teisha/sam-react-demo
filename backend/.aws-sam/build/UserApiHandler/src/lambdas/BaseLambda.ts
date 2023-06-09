import { APIGatewayProxyResult } from "aws-lambda";

export interface LambdaReturnType {
  statusCode: number;
  body?: string;
  "X-Amz-Function-Error": string;
}

export class BaseHandler {
  constructor() {}
  handleError(code: number, message?: string): APIGatewayProxyResult {
    const returnVal = {
      statusCode: code,
    } as APIGatewayProxyResult;

    if (message) {
      returnVal.body = JSON.stringify({ message });
    }
    returnVal["X-Amz-Function-Error"] = message;
    console.log(`RETURNING:: ${JSON.stringify(returnVal)}`);
    return returnVal;
  }
  handleReturn(message: string): APIGatewayProxyResult {
    const returnVal = {
      statusCode: 200,
      body: JSON.stringify({ message }),
    } as APIGatewayProxyResult;

    console.log(`RETURNING:: ${JSON.stringify(returnVal)}`);
    return returnVal;
  }
}
