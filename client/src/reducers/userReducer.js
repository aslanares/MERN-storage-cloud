const SET_USER = "SET_USER"
const LOGOUT = "LOGOUT"
const SET_USERNAME = "SET_USERNAME"
const SET_EMAIL = "SET_EMAIL"
const DISPLAY_SEARCH = "DISPLAY_SEARCH"
const HIDE_SEARCH = "HIDE_SEARCH"

const defaultState = {
    currentUser: {},
    currentUsername: '',
    currentEmail: '',
    isAuth: false,
    isSearch: true
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case DISPLAY_SEARCH:
            return {...state, isSearch: true}
        case HIDE_SEARCH:
            return {...state, isSearch: false}
        case SET_USER:
            return {...state, currentUser: action.payload, isAuth: true}
        case SET_USERNAME:
            return {...state, currentUsername: action.payload, isAuth: true}
        case SET_EMAIL:
            return {...state, currentEmail: action.payload, isAuth: true}
        case LOGOUT:
            localStorage.removeItem('token')
            return {...state, currentUser: {}, isAuth: false}
        default:
            return state
    }
}

export const displaySearch = () => ({type: DISPLAY_SEARCH})
export const hideSearch = () => ({type: HIDE_SEARCH})
export const setUser = user => ({type: SET_USER, payload: user})
export const setUsername = username => ({type: SET_USERNAME, payload: username})
export const setEmail = email => ({type: SET_EMAIL, payload: email})
export const logout = () => ({type: LOGOUT})
