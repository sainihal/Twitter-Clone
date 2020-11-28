import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "./actionTypes";

const initState = {
  loginError: false,
  registerError: false,
  login_message: "",
  register_message: "",
  isAuth: false,
  accessToken: "",
  userData: {},
  isLoading: false,
};

export default (state = initState, { type, payload }) => {
  switch (type) {
    case REGISTER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        registerError: false,
        register_message: "",
        login_message: "",
      };
    }
    case REGISTER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        registerError: false,
        register_message: "Register successful login to continue",
        login_message: "",
      };
    }
    case REGISTER_FAILURE: {
      return {
        ...state,
        isLoading: false,
        registerError: true,
        register_message: payload.message,
        login_message: "",
      };
    }
    case LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
        loginError: false,
        login_message: "",
        register_message: "",
        isAuth: false,
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        isAuth: true,
        loginError: false,
        userData: payload.data.userData,
        accessToken: payload.data.accessToken,
        isLoading: false,
        login_message: payload.data.message,
        register_message: "",
      };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        isAuth: false,
        loginError: true,
        login_message: payload.message,
        accessToken: "",
        isLoading: false,
        register_message: "",
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isAuth: false,
        loginError: false,
        login_message: "",
        accessToken: "",
        isLoading: false,
        register_message: "",
        register_error: "",
        isLoading: false,
      };
    }
    default:
      return {
        ...state,
      };
  }
};
