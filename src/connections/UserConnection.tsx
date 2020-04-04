export default class UserConnection {
  public static currentUser: User | undefined = undefined

  public static isLogin = (): boolean => UserConnection.currentUser !== undefined
}

interface User {
  username: string
  email: string
  password: string
}