class UserConnection {
  public static instance = new UserConnection()
  // public a = window.sessionStorage.clear()
  
  public sessionEBD = window.sessionStorage.getItem('users')
  public userDB: User[] = this.sessionEBD? JSON.parse(this.sessionEBD) as User[]: []
  public sessionCU = window.sessionStorage.getItem('currentUser')
  public currentUser: User | undefined = this.sessionCU? JSON.parse(this.sessionCU) as User: undefined
  
  public isLogin = (): boolean => this.currentUser !== undefined

  public authenticate = (input: string, password: string) => new Promise<User>((resolve, reject) => {
    resolve(this.userDB.find(user => user.username === input || user.email === input))
  }).then(user => {
    if(user) {
      if(user.password === password) {
        this.currentUser = user
        window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      } else {
        throw new Error('Please enter the username and password again')
      }
    } else {
      throw new Error('No acc')
    }
  }).then(() => 'Login Successfully')

  public register = (username: string, email: string, password: string) => new Promise<boolean>((resolve, reject) => 
    resolve(this.userDB.find(user => user.email === email) == null)
  ).then(hasUser => {
    if(hasUser) {
      this.currentUser = {username, email, password}
      this.userDB = [...this.userDB, this.currentUser]
      window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser))
      window.sessionStorage.setItem('users', JSON.stringify(this.userDB))
    } else {
      throw new Error('Email is used')
    }
  }).then(() => 'Register Successfully')

  public setDetail = () => new Promise((resolve, reject) => {
    resolve();
  })
}

interface User {
  username: string
  email: string
  password: string
  detail?: UserDetail
}

interface UserDetail {
  fullname: string
  age: number
  gender: 'M' | 'F'
  contacts?: {
    type: 'email' | 'phone'
    value: string
  } []
  
  medicalInstituition: {
    role: string
    name: string
    address: string
    department?: string
  }
}

export default UserConnection.instance