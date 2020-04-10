class UserConnection {
  public static instance = new UserConnection()
  // public a = window.sessionStorage.clear()

  public mockUserDB: User[] = [
    { username: 'Xian Jun', password: '', email: '', detail: { fullname: 'Xian Jun', age: 20, gender: 'M' } },
    { username: 'Cecil Shea', password: '', email: '', detail: { fullname: 'Cecil Shea', age: 25, gender: 'F' } },
    { username: 'Terri Woodard', password: '', email: '', detail: { fullname: 'Terri Woodard', age: 42, gender: 'M' } },
    { username: 'Vinay Burt', password: '', email: '', detail: { fullname: 'Vinay Burt', age: 35, gender: 'M' } },
    { username: 'Alessandro Barron', password: '', email: '', detail: { fullname: 'Alessandro Barron', age: 32, gender: 'M' } },
    { username: 'Shreya Mejia', password: '', email: '', detail: { fullname: 'Shreya Mejia', age: 28, gender: 'F' } },
    { username: 'Leyton Guevara', password: '', email: '', detail: { fullname: 'Leyton Guevara', age: 26, gender: 'F' } },
    { username: 'Yuvray Lenno', password: '', email: '', detail: { fullname: 'Yuvray Lenno', age: 18, gender: 'F' } },
    { username: 'Teejay Velaquez', password: '', email: '', detail: { fullname: 'Teejay Velaquez', age: 50, gender: 'M' } },
    { username: 'Jax Pierce', password: '', email: '', detail: { fullname: 'Jax Pierce', age: 39, gender: 'M' } },
  ]
  
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

export interface User {
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
  medicalStaff?: MedicalStaffDetail
  patient?: PatientDetail
}

interface MedicalStaffDetail {
  medicalInstituition: {
    role: string
    name: string
    address: string
    department?: string
  }
}

interface PatientDetail {
}

export default UserConnection.instance