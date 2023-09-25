import { APIGatewayProxyResult } from "aws-lambda";
import { Env } from "../services/environment.service";

// export interface LambdaReturnType {
//   statusCode: number;
//   body?: string;
//   "X-Amz-Function-Error": string;
// }

export class BaseHandler {
  constructor() {}
  getCorsOrigin(origin: string) {
    if (Env.getVal('STAGE') === 'dev' && origin === 'http://localhost:4000') {
      return 'http://localhost:4000'
    }
    return `https://${Env.corsOrigin}`
  }

  handleError(origin: string, code: number, message?: string): APIGatewayProxyResult {
    const returnVal = {
      statusCode: code,
    } as APIGatewayProxyResult;

    if (message) {
      returnVal.body = JSON.stringify({ message });
    }
    returnVal.headers = {
      "Access-Control-Allow-Origin": this.getCorsOrigin(origin),
    },
    // returnVal["X-Amz-Function-Error"] = message;
    console.log(`RETURNING:: ${JSON.stringify(returnVal)}`);
    return returnVal;
  }

  handleReturn(origin: string , body: string): APIGatewayProxyResult {
    const returnVal = {
      headers: {
        "Access-Control-Allow-Origin": this.getCorsOrigin(origin),
      },
      statusCode: 200,
      body,
    } as APIGatewayProxyResult;

    console.log(`RETURNING:: ${JSON.stringify(returnVal)}`);
    return returnVal;
  }
}
