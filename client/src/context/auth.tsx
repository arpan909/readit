import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "../types";

interface State {
  authentication: boolean;
  user: User | undefined;
  loading: boolean;
}
interface Action {
  type: string;
  payload: any;
}

const StateContext = createContext<State>({
  authentication: false,
  user: null,
  loading: true,
});

const DispatchContext = createContext(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authentication: true,
        user: payload,
      };

    case "LOGOUT":
      return {
        ...state,
        authentication: false,
        user: null,
      };

    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };

    default:
      throw new Error(`UNKNOWN ACTION TYPE! : ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    authentication: false,
    user: null,
    loading: true,
  });
  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("auth/me");
        //  console.log("If cond");

        if (res.data.user) {
          //  console.log("Calling dipatch!");
          dispatch({ type: "LOGIN", payload: res.data.user });
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch({ type: "STOP_LOADING", payload: undefined });
      }
    }
    loadData();
  }, []);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
