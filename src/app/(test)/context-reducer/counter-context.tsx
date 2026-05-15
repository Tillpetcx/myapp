"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

type CounterState = {
  count: number;
  username: string;
  email: string;
};

type CounterAction =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET" }
  | { type: "SET_USER"; payload: { username: string; email: string } };

const initialState: CounterState = {
  count: 0,
  username: "Guest",
  email: "",
};

function counterReducer(
  state: CounterState,
  action: CounterAction,
): CounterState {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "RESET":
      return { ...state, count: 0 };
    case "SET_USER":
      return {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
      };
    default:
      return state;
  }
}

type CounterContextType = {
  state: CounterState;
  dispatch: React.Dispatch<CounterAction>;
};

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounter() {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
}
