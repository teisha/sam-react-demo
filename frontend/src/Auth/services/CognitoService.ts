/* eslint-disable no-undef */
import ICognitoConfig from '../../models/ICognitoConfig';
import jwtDecode from 'jwt-decode';
import IAuthToken, { ICognitoToken } from '../models/IAuthToken';
import { getLogger } from '../../services/loggingService';
import { base64Encode } from '../../utils/encode';

export class CognitoService {
  private logger;
  constructor(private logLevel: string, private cognitoClientId: string) {
    this.logger = getLogger('CognitoService', logLevel);
  }

  isUserSignedIn(): boolean {
    return (
      localStorage.getItem('cognito_token') !== null &&
      localStorage.getItem('cognito_token')!.length > 0
    );
  }

  getAuthToken(): string | null {
    return localStorage.getItem('cognito_token');
  }

  setAuthToken(token: string): void {
    localStorage.setItem('cognito_token', token);
  }

  validateToken(token: string, tokenState: string, configState: string): boolean {
    const data = jwtDecode(token) as ICognitoToken;
    return data['aud'] === this.cognitoClientId && tokenState === base64Encode(configState);
  }

  // ID_TOKEN:
  // Header:
  // {
  //   "kid": "Rxbdb92wGEU0xHXUPYxMZ7+smUTI3QoGhXig5ZC8hEE=",
  //   "alg": "RS256"
  // }
  // Payload:
  // {
  //   "at_hash": "-rxDAP7ECkLP5DswG8uRsg",
  //   "sub": "f9cdee7c-a58e-49ec-8115-69808cce9c51",
  //   "aud": "7p1g2ho5eslm2vea7jf8o8f2ao",
  //   "email_verified": true,
  //   "event_id": "2379cba1-c051-4308-bff4-fd456c464fee",
  //   "token_use": "id",
  //   "auth_time": 1606507750,
  //   "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1-uniqeuid",
  //   "cognito:username": "userB",
  //   "exp": 1606511350,
  //   "iat": 1606507750,
  //   "email": "teisha@email.com"
  // }
  //http://localhost:3000/auth#id_token=eyJraWQiOiIwRGZwOW9kY0pNandmWDFkQktMVENFYjRyZk92U2tHc2d1Y1ZoaUo2dlYwPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiTlJVekI4OFd0Y0V0VHBjTTVPd0NUdyIsInN1YiI6ImNjMmNhNWI1LTUyNjgtNDUxZC05Y2YxLWYzZDg2M2Y2MDgzYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV82bGl2amhhMWkiLCJjb2duaXRvOnVzZXJuYW1lIjoiY2MyY2E1YjUtNTI2OC00NTFkLTljZjEtZjNkODYzZjYwODNhIiwiYXVkIjoiMzNsNWtscW4yaTliczNpZnE1MWlnbTg2MGEiLCJldmVudF9pZCI6IjhhOGFhZTdjLWI1MGMtNDA1Zi1hM2M5LWQwYmQ2OTc4ZDkxNyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjY5NDA2MTY1LCJleHAiOjE2Njk0MDk3NjUsImlhdCI6MTY2OTQwNjE2NSwianRpIjoiZjQzODQxZmItOGY1OS00MTk2LThhYTMtZDE5NTBiMmFlNGU0IiwiZW1haWwiOiJhaHNpZXQ0QHlhaG9vLmNvbSJ9.s_odf3ObsuQBMqdS9o47_NTszPUtwo9tKoMbdzaAIOZolWKuQ3LVUGCwRN_YQnaS1OhMmWvoK_6hHR8-hLVh2biKelMNblQN2fugB1c6-07xvCrom-YOQvkx7KXL8wzIosvticbJjiWuCHvV11U5827CItC4iaVob4PM598xWA9FVdj-G3sSYg9K5x6NKkS6uFSv4oxJUFvT4XNUXMtRPxV0Ld2CqrDqjjfVDAmDKwG_bTISUxqboV2jzROWAC5RNVfkupBI1c_OH2UE22XigGkolfBZBhnTLBOnjVSkje2TsI5oLSyhv5wa5NcWr_1XDXzeniar9sSV1C-LuDC-AA&access_token=eyJraWQiOiI3dzN4TnFNbkprVnhxT0lQRzlSSm5SN09TSVFYNXVOWXVWMURxbHYrcXlzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjYzJjYTViNS01MjY4LTQ1MWQtOWNmMS1mM2Q4NjNmNjA4M2EiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV82bGl2amhhMWkiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIzM2w1a2xxbjJpOWJzM2lmcTUxaWdtODYwYSIsImV2ZW50X2lkIjoiOGE4YWFlN2MtYjUwYy00MDVmLWEzYzktZDBiZDY5NzhkOTE3IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF1dGhfdGltZSI6MTY2OTQwNjE2NSwiZXhwIjoxNjY5NDA5NzY1LCJpYXQiOjE2Njk0MDYxNjUsImp0aSI6ImI2NzU5MzBiLWE0N2ItNGNmZS1hOWY5LWNmMGZjZjJlNWY2NiIsInVzZXJuYW1lIjoiY2MyY2E1YjUtNTI2OC00NTFkLTljZjEtZjNkODYzZjYwODNhIn0.HsdHgPSWZHYI5tCx4xi7ERcoK_8R-kD9b0emIfL0LdI35NgLh2q_m9NjJGsT-9kDYtUtlfUPduZoMkj6zwuH6a4g80ySoZAeB-AylirLnz7hiMF2eEPdruAc3lTt_Q1bQIH12Xqx1RKrVm34wN8wPsT6QYqH1bPAWCn8bQ3mRevh4IFt3ZN4bJf9Xj9RE49o960X_b1uln6t6D1D2BLUXfXNwJjv7wI2vWk_BBqagXcMCW9Y5Dvk25RHNeWW53YY87XlUw0C-u5TXOChNN6EE9lnupih9ShJa5PJwUkATXdxOsqn2KMCYaCwqgYWoE9Rc3hkHNDLqN4aHvQ7mSQSeQ&expires_in=3600&token_type=Bearer&state=If%20You%20Get%20These%20Texts,%20Delete%20Them%20Immediately

  parseIdToken(token: string): IAuthToken {
    console.log('Parse Id Token');
    const data = jwtDecode(token) as ICognitoToken;
    console.log(data);
    return {
      rawtoken: token,
      cognito_username: data['cognito:username'],
      email: data['email'],
      auth_time: data['auth_time'],
      expires: data['exp'],
      issued_at: data['iat'],
      is_expired: Date.now() / 1000 > data['exp'],
    };
  }

  // ACCESS TOKEN:
  // Header:
  // {
  //   "kid": "eeebqdwD2AQIY+EEbrUdX61GseYG/uJgpwRD3M5FW9k=",
  //   "alg": "RS256"
  // }
  // Payload:
  // {
  //   "sub": "f9cdee7c-a58e-49ec-8115-69808cce9c51",
  //   "event_id": "2379cba1-c051-4308-bff4-fd456c464fee",
  //   "token_use": "access",
  //   "scope": "openid profile email",
  //   "auth_time": 1606507750,
  //   "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_89k06lCSA",
  //   "exp": 1606511350,
  //   "iat": 1606507750,
  //   "version": 2,
  //   "jti": "f98e0d1c-42b0-4c42-88b4-9ef9ab9fbaba",
  //   "client_id": "7p1g2ho5eslm2vea7jf8o8f2ao",
  //   "username": "userB"
  // }

  getRedirectToSignInUrl(config: ICognitoConfig): string {
    const url = `https://${config.cognito_domain}.auth.${config.region}.amazoncognito.com/login?response_type=${config.cognito_response_type}&client_id=${config.cognito_client_id}&redirect_uri=${config.cognito_redirect_url}&state=${base64Encode(config.cognito_state)}`;
    this.logger.debug('COGNITO LOGIN URL:: ' + url);
    if (!config.region) {
      return '/';
    }
    return url;
  }

  getLogoutUrl(config: ICognitoConfig): string {
    const logout_uri = `${config.cognito_redirect_url.replace('/auth', '').replace('.html', '')}`;
    const url = `https://${config.cognito_domain}.auth.${config.region}.amazoncognito.com/logout?client_id=${config.cognito_client_id}&logout_uri=${logout_uri}`;
    this.logger.debug(`LOGOUT ${url}`);
    this.setAuthToken('');
    return url;
  }
}
