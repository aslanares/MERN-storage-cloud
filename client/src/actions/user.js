import axios from 'axios'
import {setEmail, setUser, setUsername} from "../reducers/userReducer";
import {API_URL, config} from "../config";

export const registration = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/registration`, {
            username,
            email,
            password
        })
        alert(response.data.message)
    } catch (e) {
        alert(e.response.data.message)
    }
}

export const login = (email, password) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/auth/login`, {
                email,
                password
            })
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const auth = () => {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/auth/auth`, config)
            dispatch(setUser(response.data.user))
            localStorage.setItem('token', response.data.token)
        } catch (e) {
            localStorage.removeItem('token')
        }
    }
}

export const changePass = (email, oldPass, newPass, confirmNewPass) => {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/auth/changepass`, {
                email,
                oldPass,
                newPass,
                confirmNewPass
            })
            alert(response.data.message)
            localStorage.setItem('token', response.data.token)
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}

export const uploadAvatar = (file) => {
    return async dispatch => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await axios.post(`${API_URL}api/files/avatar`, formData, config)
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

export const deleteAvatar =  () => {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files/avatar`, config)
            dispatch(setUser(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

export const changeUsername = (username) => {
    return async dispatch => {
        try {
            await axios.post(`${API_URL}api/files/username`,
              { username }, config,
              dispatch(setUsername(username))
            )
        } catch (e) {
            console.log(e)
        }
    }
}

export const changeEmail = (email) => {
    return async dispatch => {
        try {
            await axios.post(`${API_URL}api/files/email`, { email }, config,
              dispatch(setEmail(email))
            )
        } catch (e) {
            console.log(e)
        }
    }
}