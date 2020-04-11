class RecordConnection {
  public static instance =  new RecordConnection()

  public recordDB: Record[] = [
    { 
      id: 1, name: 'Teejay Velazquez', type: 'health prescription', date: new Date('2020-3-27'), 
      illness: 'Type 1 Diabetes', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 2, name: 'Terri Woodard', type: 'health prescription', date: new Date('2020-3-27'), 
      illness: 'Asthma', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 3, name: 'Leong Xian Jun', type: 'health prescription', date: new Date('2020-3-28'), appID: 8, 
      illness: 'Sore Throat', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 4, name: 'Teejay Velazquez', type: 'medication record', date: new Date('2020-3-27'), prescriptionID: 1,
      medications: []
    },
    { 
      id: 5, name: 'Terri Woodard', type: 'medication record', date: new Date('2020-3-27'), prescriptionID: 2,
      medications: []
    },
    { 
      id: 6, name: 'Terri Woodard', type: 'medication record', date: new Date('2020-3-28'), prescriptionID: 2,
      medications: []
    },
    { 
      id: 7, name: 'Leong Xian Jun', type: 'medication record', date: new Date('2020-3-28'), prescriptionID: 3,
      medications: []
    },
    { 
      id: 8, name: 'Leong Xian Jun', type: 'medication record', date: new Date('2020-3-30'), prescriptionID: 3,
      medications: []
    },
    { 
      id: 9, name: 'Jax Pierce', type: 'lab test result', date: new Date('2020-3-30'), appID: 4, comment: 'Time to work out more', title: 'Urine Test',
      data: [ 
        {field: 'Epinephrine', result: '60', normalRange: '0 - 20' },
        {field: 'Metanephrine', result: '3,232', normalRange: '0 - 1,000' },
        {field: 'Norepinephrine', result: '63.4', normalRange: '15 - 80' },
        {field: 'Normepinephrine', result: '373', normalRange: '109 - 500' },
        {field: 'Dopamine', result: '222', normalRange: '65 - 400' }
      ] 
    },
    { id: 10, name: 'Leong Xian Jun', type: 'lab test result', date: new Date('2020-3-30'), appID: 9, comment: 'Time to work out more', title: 'Blood Test',
      data: [ 
        {field: 'White Blood Cells', result: '1,400', normalRange: '4,000 - 11,000' }, 
        {field: 'Neutrophils', result: '800', normalRange: '1,500 - 5,000' }, 
        {field: 'Red Blood Cells', result: '2,100,000', normalRange: '4,500,000 - 6,500,000' }, 
        {field: 'Heamoglobin', result: '7.1g/dl', normalRange: '13 - 18' }, 
        {field: 'Hematocrit', result: '20%', normalRange: '40 - 54' }
      ] 
    },
    { 
      id: 11, name: 'Leong Xian Jun', type: 'health prescription', date: new Date('2020-4-16'), appID: 9, 
      illness: 'Sore Throat', clinicalOpinion: 'Rest More and Take Medication on Time'
    },
    { 
      id: 12, name: 'Leong Xian Jun', type: 'medication record', date: new Date('2020-4-16'), prescriptionID: 11,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Aspirin', dosage: 10, usage: '2mL' }
      ]
    },
    { 
      id: 13, name: 'Leong Xian Jun', type: 'medication record', date: new Date('2020-4-20'), prescriptionID: 11,
      medications: [
        { medicine: 'Acetaminophen (Tylenol)', dosage: 10, usage: '2mL' },
        { medicine: 'Ibuprofen (Advil, Motrin)', dosage: 15, usage: '3mL' },
        { medicine: 'Tuns', dosage: 15, usage: '3mL' },
        { medicine: 'Cimetidine (Tagamet HB', dosage: 30, usage: '5mL' },
        { medicine: 'Iansoprazole (Prevacid 24)', dosage: 25, usage: '5mL' }
      ]
    }
  ]
  public selectedRecord: Record = this.recordDB[9]

  public addNewHealthPrescription = (patientName: string, illness: string, clinicalOpinion: string, medicines: {medicine: string, dosage: number, usage: string}[]) => {
    const newHP: Record = { 
      id: this.recordDB.length, 
      name: patientName, 
      type: 'health prescription', 
      date: new Date(), 
      illness: illness,
      clinicalOpinion: clinicalOpinion
    }
    this.recordDB = [...this.recordDB, newHP]
    this.addNewMedicationRecord(medicines, newHP.id)
  }

  public addNewMedicationRecord = (medicines: {medicine: string, dosage: number, usage: string}[], prescriptionID?: number) => {
    this.recordDB = [
      ...this.recordDB,
      { 
        id: this.recordDB.length, 
        name: this.selectedRecord.name, 
        type: 'medication record', 
        date: new Date(), 
        prescriptionID: prescriptionID ?? this.selectedRecord.id,
        medications: medicines
      }
    ]
  }

  public addNewLabTestResult = (patientName: string, title: string, comment: string, data: { field: string, result: string, normalRange: string }[], appID: number) => {
    this.recordDB = [
      ...this.recordDB,
      { 
        id: this.recordDB.length, 
        name: patientName, 
        type: 'lab test result',
        date: new Date(),
        title, comment, appID, data
      }
    ]
  }
}

export type Record = HealthPrescription | MedicationRecord | LabTestResult

type RecordDetail = {
  id: number
  name: string
  date: Date
}

export type HealthPrescription = RecordDetail & {
  type: 'health prescription'
  appID?: number // appointment id
  illness: string
  clinicalOpinion: string
}

export type MedicationRecord = RecordDetail & {
  type: 'medication record'
  prescriptionID: number
  medications: {
    medicine: string
    dosage: number
    usage: string
  } []
}

export type LabTestResult = RecordDetail & {
  type: 'lab test result'
  appID: number // appointment id
  title: string
  comment: string
  data: { 
    field: string
    result: string
    normalRange: string
  }[]
}

export default RecordConnection.instance