export const API_URL = 'http://localhost:5000/'
export const config = {
  headers: {
    Authorization:`Bearer ${localStorage.getItem('token')}`
  }
}