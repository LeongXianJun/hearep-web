import qs from 'qs'
import { UserStore, Patient } from '.'
import { StoreBase, AutoSubscribeStore, autoSubscribeWithKey } from 'resub'

@AutoSubscribeStore
class HealthRecordStore extends StoreBase {
  private selectedPatient: Patient | undefined
  private healthPrescriptions: HealthPrescription[]
  private labTestResults: LabTestResult[]
  private selectedRecord: HR | undefined

  constructor() {
    super()
    this.healthPrescriptions = []
    this.labTestResults = []
  }

  private getToken = () => UserStore.getToken()

  fetchPatientRecords = (patientId: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/healthrecords/medicalstaff', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({ userToken, patientId })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(data => {
          if (data.errors) {
            throw new Error(data.errors)
          } else {
            this.healthPrescriptions = data[ 'Health Prescription' ].map((hr: any) => new HealthPrescription(hr))
            this.labTestResults = data[ 'Lab Test Result' ].map((hr: any) => new LabTestResult(hr))
            this.trigger(HealthRecordStore.HRKey)
          }
        }).catch(err => Promise.reject(new Error('Fetch Health Records: ' + err)))
      } else {
        throw new Error('No Token Found')
      }
    })

  insertHealthRecord = (input: { patientId: string, date: Date } & ({ type: 'Health Prescription', appId: string, illness: string, clinicalOpinion: string } | { type: 'Medication Record', prescriptionId: string, medications: Medication[] } | { type: 'Lab Test Result', appId: string, title: string, comment: string, data: LabTestField[] })) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        return await fetch('http://localhost:8001/healthrecords/insert', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            healthRecord: {
              ...input
            }
          })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          } else if (result[ 'response' ].includes('success')) {
            return { hrid: result.docId }
          }
        })
          .catch(err => { throw new Error(err) })
      } else {
        throw new Error('No Token Found')
      }
    })

  updateHealthRecord = ({ type, ...input }: { id: string } & ({ type: 'Health Prescription', illness: string, clinicalOpinion: string } | { type: 'Medication Record', prescriptionId: string, medications: Medication[] } | { type: 'Lab Test Result', title: string, comment: string, data: LabTestField[] })) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/healthrecords/update', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            healthRecord: {
              ...input
            }
          })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          }
        })
          .catch(err => new Error(err))
      } else {
        throw new Error('No Token Found')
      }
    })

  removeHealthRecord = (id: string) =>
    this.getToken().then(async userToken => {
      if (userToken) {
        await fetch('http://localhost:8001/healthrecords/delete', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: qs.stringify({
            userToken,
            id
          })
        }).then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error(response.status + ': (' + response.statusText + ')')
          }
        }).then(result => {
          if (result.errors) {
            throw new Error(result.errors)
          }
        })
          .catch(err => new Error(err))
      } else {
        throw new Error('No Token Found')
      }
    })

  static HRKey = 'HRKey'
  @autoSubscribeWithKey('HRKey')
  getHealthRecords() {
    return {
      healthPrescriptions: this.healthPrescriptions,
      labTestResults: this.labTestResults
    }
  }

  static SelectedPatientKey = 'SelectedPatientKey'
  @autoSubscribeWithKey('SelectedPatientKey')
  getSelectedPatient() {
    return this.selectedPatient
  }

  setSelectedPatient(patient: Patient) {
    this.selectedPatient = patient
  }

  static SelectedRecordKey = 'SelectedRecordKey'
  @autoSubscribeWithKey('SelectedRecordKey')
  getSelectedHPRecord() {
    return this.selectedRecord as HealthPrescription
  }

  @autoSubscribeWithKey('SelectedRecordKey')
  getSelectedLTRRecord() {
    return this.selectedRecord as LabTestResult
  }

  setSelectedRecord(record: HR) {
    this.selectedRecord = record
  }
}

class HealthRecord {
  id: string
  medicalStaffId: string
  patientId: string
  date: Date

  constructor(input: any) {
    const { id, medicalStaffId, patientId, date } = input
    this.id = id
    this.medicalStaffId = medicalStaffId
    this.patientId = patientId
    this.date = new Date(date)
  }
}

class HealthPrescription extends HealthRecord {
  type: 'Health Prescription' = 'Health Prescription'
  appId: string
  illness: string
  clinicalOpinion: string
  medicationRecords: MedicationRecord[]

  constructor(input: any) {
    super({ ...input })
    const { appId, illness, clinicalOpinion, medicationRecords } = input
    this.appId = appId
    this.illness = illness
    this.clinicalOpinion = clinicalOpinion
    this.medicationRecords = (medicationRecords as Array<any>).map(mr => new MedicationRecord(mr))
  }
}

class MedicationRecord extends HealthRecord {
  type: 'Medication Record' = 'Medication Record'
  prescriptionId: string
  medications: Medication[]

  constructor(input: any) {
    super({ ...input })
    const { prescriptionId, medications } = input
    this.prescriptionId = prescriptionId
    this.medications = (medications as Array<any>).map(m => new Medication(m))
  }
}

class LabTestResult extends HealthRecord {
  type: 'Lab Test Result' = 'Lab Test Result'
  appId: string
  title: string
  comment: string
  data: LabTestField[]

  constructor(input: any) {
    super({ ...input })
    const { appId, title, comment, data } = input
    this.appId = appId
    this.title = title
    this.comment = comment
    this.data = (data as Array<any>).map(d => new LabTestField(d))
  }
}

class Medication {
  medicine: string
  dosage: number
  usage: string

  constructor(input: any) {
    const { medicine, dosage, usage } = input
    this.medicine = medicine
    this.dosage = dosage
    this.usage = usage
  }
}

class LabTestField {
  field: string
  value: string
  normalRange: string

  constructor(input: any) {
    const { field, value, normalRange } = input
    this.field = field
    this.value = value
    this.normalRange = normalRange
  }
}

type HR = HealthPrescription | MedicationRecord | LabTestResult
export {
  HealthPrescription,
  MedicationRecord,
  LabTestResult
}
export default new HealthRecordStore()