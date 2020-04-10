class UserConnection {
  public static instance = new UserConnection()
  // public a = window.sessionStorage.clear()

  public mockUserDB: User[] = [
    { username: 'Dr. JoneLeong', password: '123123123', email: 'leongxianjun@utar.my', type: 'medicalStaff', detail: { fullname: 'Jone Leong', age: 21, gender: 'M' } },
    { 
      username: 'Xian Jun', password: '', email: 'leongxianjun@utar.my', type: 'patient',
      detail: { 
        fullname: 'Leong Xian Jun', age: 20, gender: 'M', 
        contacts: [
          { type: 'email', value: 'joneleong@gmail.com' }, 
          { type: 'phone', value: '+60-165663878' }
        ] 
      } 
    },
    { username: 'Cecil Shea', password: '', email: '', type: 'patient', detail: { fullname: 'Cecil Shea', age: 25, gender: 'F' } },
    { username: 'Terri Woodard', password: '', email: '', type: 'patient', detail: { fullname: 'Terri Woodard', age: 42, gender: 'M' } },
    { username: 'Vinay Burt', password: '', email: '', type: 'patient', detail: { fullname: 'Vinay Burt', age: 35, gender: 'M' } },
    { username: 'Alessandro Barron', password: '', email: '', type: 'patient', detail: { fullname: 'Alessandro Barron', age: 32, gender: 'M' } },
    { username: 'Shreya Mejia', password: '', email: '', type: 'patient', detail: { fullname: 'Shreya Mejia', age: 28, gender: 'F' } },
    { username: 'Leyton Guevara', password: '', email: '', type: 'patient', detail: { fullname: 'Leyton Guevara', age: 26, gender: 'F' } },
    { username: 'Yuvray Lenno', password: '', email: '', type: 'patient', detail: { fullname: 'Yuvray Lenno', age: 18, gender: 'F' } },
    { username: 'Teejay Velaquez', password: '', email: '', type: 'patient', detail: { fullname: 'Teejay Velaquez', age: 50, gender: 'M' } },
    { username: 'Jax Pierce', password: '', email: '', type: 'patient', detail: { fullname: 'Jax Pierce', age: 39, gender: 'M' } },
  ]
  public selectedPatient: User | undefined = this.mockUserDB[1]
  



  public sessionEBD = window.sessionStorage.getItem('users')
  public userDB: User[] = this.sessionEBD? JSON.parse(this.sessionEBD) as User[]: []
  public sessionCU = window.sessionStorage.getItem('currentUser')
  public currentUser: User | undefined = this.sessionCU? JSON.parse(this.sessionCU) as User: this.mockUserDB[0] //undefined
  
  public isLogin = (): boolean => this.currentUser !== undefined

  public authenticate = (input: string, password: string) => new Promise<User>((resolve, reject) => {
    resolve(this.userDB.find(user => user.type === 'medicalStaff' && (user.username === input || user.email === input)))
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
      this.currentUser = {username, email, password, type: 'medicalStaff'}
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

export type User = {
  username: string
  email: string
  password: string
  detail?: {
    fullname: string
    age: number
    gender: 'M' | 'F'
    contacts?: {
      type: 'email' | 'phone'
      value: string
    } []
  }
} & (
  {
    type: 'medicalStaff'
    medicalInstituition?: {
      role: string
      name: string
      address: string
      department?: string
    }
  } | {
    type: 'patient'
    occupation?: string
  }
)

export default UserConnection.instance