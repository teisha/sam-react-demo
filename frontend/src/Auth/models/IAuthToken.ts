export default interface IAuthToken {
  rawtoken: string;
  cognito_username?: string;
  email?: string;
  auth_time?: number;
  expires?: number;
  issued_at?: number;
  is_expired: boolean;
}

//   "auth_time": 1606507750,
//   "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_89k06lCSA",
//   "cognito:username": "userB",
//   "exp": 1606511350,
//   "iat": 1606507750,
//   "email": "teish@emailcom"

export interface ICognitoToken {
  at_hash: string;
  sub: string;
  aud: string;
  email_verified: boolean;
  event_id: string;
  token_use: string;
  auth_time: number;
  iss: string;
  'cognito:username': string;
  exp: number;
  iat: number;
  email: string;
}

