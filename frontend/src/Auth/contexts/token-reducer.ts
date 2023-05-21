import IAuthToken from '../models/IAuthToken';

export enum TokenActions {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CHECK_EXPIRED = 'CHECK_EXPIRED',
}

interface TokenState {
  token: IAuthToken | null;
}
interface ReducerActions {
  type: TokenActions;
  token?: IAuthToken;
}

const setAuthToken = (token: IAuthToken, state: TokenState) => {
  const updatedToken = { ...token };
  console.log(`set AuthToken: ${JSON.stringify(updatedToken)}`);
  console.log({ ...state, token: updatedToken });
  return { ...state, token: updatedToken };
};

const logout = (state: TokenState) => {
  return { ...state, token: null };
};

export const isTokenExpired = (token: IAuthToken) => {
  return token.expires ? Date.now() / 1000 > token.expires : true;
};

const checkTokenExpired = (state: TokenState) => {
  const updatedToken: IAuthToken = ({ ...state.token } as IAuthToken) ?? { token: null };
  updatedToken.is_expired = isTokenExpired(updatedToken);
  console.log(`Is this expired?: ${JSON.stringify(updatedToken)} `);
  return { ...state, token: updatedToken };
};

export const tokenReducer = (state: TokenState, action: ReducerActions) => {
  switch (action.type) {
    case TokenActions.LOGIN:
      return setAuthToken(action.token!, state);
    case TokenActions.LOGOUT:
      return logout(state);
    case TokenActions.CHECK_EXPIRED:
      return checkTokenExpired(state);
    default:
      return state;
  }
};
