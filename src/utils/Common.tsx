const getDayOfWeek = (i: 0 | 1 | 2 | 3 | 4 | 5 | 6) =>
  [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ][ i ]

const getMonth = (i: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | number, shortForm?: boolean) =>
  shortForm
    ? [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][ i ]
    : [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ][ i ]

const getURL = () =>
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8001'
    : process.env.REACT_APP_ServerURL

export default {
  getDayOfWeek,
  getMonth,
  getURL
}