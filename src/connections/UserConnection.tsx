class UserConnection {
  public static instance = new UserConnection()
  // public a = window.sessionStorage.clear()

  public mockUserDB: User[] = [
    { id: 1, username: 'Dr. JoneLeong', password: '123123123', email: 'leongxianjun@1utar.my', type: 'medicalStaff', 
      detail: { 
        fullname: 'Jone Leong', age: 21, gender: 'M', 
        contacts: [
          { type: 'email', value: 'joneleong@gmail.com' }, 
          { type: 'phone', value: '+60-165663878' }
        ] 
      },
      medicalInstituition: {
        role: 'Doctor',
        name: 'Leong Hospital',
        address: '40, Jalan Berjaya, Sungai Chua, 43000 Kajang, Selangor',
        department: 'Common Illness'
      }
    },
    { 
      id: 2, username: 'Xian Jun', password: '', email: 'leongxianjun@utar.my', type: 'patient',
      detail: { 
        fullname: 'Leong Xian Jun', age: 20, gender: 'M', 
        contacts: [
          { type: 'email', value: 'joneleong@gmail.com' }, 
          { type: 'phone', value: '+60-165663878' }
        ] 
      } 
    },
    { id: 3, username: 'Cecil Shea', password: '', email: '', type: 'patient', detail: { fullname: 'Cecil Shea', age: 25, gender: 'F' } },
    { id: 4, username: 'Terri Woodard', password: '', email: '', type: 'patient', detail: { fullname: 'Terri Woodard', age: 42, gender: 'M' } },
    { id: 5, username: 'Vinay Burt', password: '', email: '', type: 'patient', detail: { fullname: 'Vinay Burt', age: 35, gender: 'M' } },
    { id: 6, username: 'Alessandro Barron', password: '', email: '', type: 'patient', detail: { fullname: 'Alessandro Barron', age: 32, gender: 'M' } },
    { id: 7, username: 'Shreya Mejia', password: '', email: '', type: 'patient', detail: { fullname: 'Shreya Mejia', age: 28, gender: 'F' } },
    { id: 8, username: 'Leyton Guevara', password: '', email: '', type: 'patient', detail: { fullname: 'Leyton Guevara', age: 26, gender: 'F' } },
    { id: 9, username: 'Yuvray Lenno', password: '', email: '', type: 'patient', detail: { fullname: 'Yuvray Lenno', age: 18, gender: 'F' } },
    { id: 10, username: 'Teejay Velaquez', password: '', email: '', type: 'patient', detail: { fullname: 'Teejay Velaquez', age: 50, gender: 'M' } },
    { id: 11, username: 'Jax Pierce', password: '', email: '', type: 'patient', detail: { fullname: 'Jax Pierce', age: 39, gender: 'M' } },
  ]
  public selectedPatient: User = this.mockUserDB[1]
  

  
  public sessionCU = window.sessionStorage.getItem('currentUser')
  public currentUser: User | undefined = this.sessionCU? JSON.parse(this.sessionCU) as User: undefined
  
  public isLogin = (): boolean => this.currentUser !== undefined
  public logout = () => this.currentUser = undefined

  public authenticate = (input: string, password: string) => new Promise<User>((resolve, reject) => {
    resolve(this.mockUserDB.find(user => user.type === 'medicalStaff' && (user.username === input || user.email === input)))
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
    resolve(this.mockUserDB.find(user => user.email === email) == null)
  ).then(hasUser => {
    if(hasUser) {
      this.currentUser = {id: this.mockUserDB.length, username, email, password, type: 'medicalStaff'}
      this.mockUserDB = [...this.mockUserDB, this.currentUser]
      window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    } else {
      throw new Error('Email is used')
    }
  }).then(() => 'Register Successfully')

  public updateProfileDetail = (latest: {fullname: string, age: number, gender: 'M' | 'F', altEmail?: string, phoneNumber?: string, institution?: string, role?: string, intAdd?: string, department?: string}) => {
    const {altEmail, phoneNumber, institution, role, intAdd, department } = latest
    const index = this.mockUserDB.findIndex(u => u.id === this.currentUser?.id)
    if(index > -1) {
      this.mockUserDB = [
        ...this.mockUserDB.slice(0, index), 
        {
          ...this.mockUserDB[index], 
          'detail': {
            ...latest,
            'contacts': [
              { type: 'email', value: altEmail ?? '' },
              { type: 'phone', value: phoneNumber ?? '' }
            ]
          },
          'type': 'medicalStaff',
          'medicalInstituition': {
            name: institution,
            address: intAdd,
            role, department
          }
        },
        ...this.mockUserDB.slice(index + 1)
      ]
    }
  }
}

export type User = {
  id: number
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
      role?: string
      name?: string
      address?: string
      department?: string
    }
  } | {
    type: 'patient'
    occupation?: string
  }
)

export default UserConnection.instance