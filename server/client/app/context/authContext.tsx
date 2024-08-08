import { createContext, Dispatch, useContext, useReducer } from "react";

interface AuthState {
  isAuthenticated: boolean;
  accountId: string;
  accountName: string;
}

const initialState = {
  isAuthenticated: false,
  accountId: null,
  accountName: null,
};

type AuthAction =
  | {
      type: "account/login";
      payload: { accountId: string; accountName: string };
    }
  | { type: "account/logout" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// const AuthContext = createContext(undefined);

const authReducer = (state, action) => {
  switch (action.type) {
    case "account/login":
      return {
        ...state,
        isAuthenticated: true,
        accountId: action.payload.accountId,
        accountName: action.payload.accountName,
      };
    case "account/logout":
      return {
        ...state,
        isAuthenticated: false,
        accountId: null,
        accountName: null,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
