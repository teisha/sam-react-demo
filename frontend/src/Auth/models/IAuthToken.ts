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
//   "cognito:username": "ahsiet",
//   "exp": 1606511350,
//   "iat": 1606507750,
//   "email": "ahsiet@yahoo.com"

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

// export type DecodedToken = {
//   readonly email: string;
//   readonly exp: number;
// }

//   get authorizationString() {
//       return `Bearer ${this.token}`;
//   }

//   get expiresAt(): Date {
//       return new Date(this.decodedToken.exp * 1000);
//   }

//   get isExpired(): boolean {
//       return new Date() > this.expiresAt;
//   }

//   get isValid(): boolean {
//       return !this.isExpired;
//   }

// }
