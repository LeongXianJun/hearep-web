class RecordConnection {
  public static instance =  new RecordConnection()

  public recordDB: Record[] = [
    { name: 'Jax Pierce' },
    { name: 'Teejay Velazquez' },
    { name: 'Terri Woodard' }
  ]

}

interface Record {
  name: string
}

export interface HealthRecord extends Record {

}

export interface MedicationRecord extends Record {

}

export default RecordConnection.instance