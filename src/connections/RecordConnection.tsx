class RecordConnection {
  public static instance =  new RecordConnection()

  public recordDB: Record[] = [
    { 
      id: 1, name: 'Teejay Velazquez', type: 'health prescription', date: new Date('2020-3-27'), 
      illness: 'Type 1 Diabetes', clinicalOpinion: ''
    },
    { 
      id: 2, name: 'Terri Woodard', type: 'health prescription', date: new Date('2020-3-27'), 
      illness: 'Asthma', clinicalOpinion: ''
    },
    { 
      id: 3, name: 'Leong Xian Jun', type: 'health prescription', date: new Date('2020-3-28'), appID: 5, 
      illness: 'Sore Throat', clinicalOpinion: ''
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
      id: 9, name: 'Jax Pierce', type: 'lab test result', date: new Date('2020-3-30'), appID: 1, title: 'Urine Test',
      data: [ 
        {field: 'Epinephrine', result: '60', normalRange: '0 - 20' },
        {field: 'Metanephrine', result: '3,232', normalRange: '0 - 1,000' },
        {field: 'Norepinephrine', result: '63.4', normalRange: '15 - 80' },
        {field: 'Normepinephrine', result: '373', normalRange: '109 - 500' },
        {field: 'Dopamine', result: '222', normalRange: '65 - 400' }
      ] 
    },
    { id: 10, name: 'Leong Xian Jun', type: 'lab test result', date: new Date('2020-3-30'), appID: 6, title: 'Blood Test',
      data: [ 
        {field: 'White Blood Cells', result: '1,400', normalRange: '4,000 - 11,000' }, 
        {field: 'Neutrophils', result: '800', normalRange: '1,500 - 5,000' }, 
        {field: 'Red Blood Cells', result: '2,100,000', normalRange: '4,500,000 - 6,500,000' }, 
        {field: 'Heamoglobin', result: '7.1g/dl', normalRange: '13 - 18' }, 
        {field: 'Hematocrit', result: '20%', normalRange: '40 - 54' }
      ] 
    },
    { 
      id: 11, name: 'Leong Xian Jun', type: 'health prescription', date: new Date('2020-4-16'), appID: 6, 
      illness: 'Sore Throat', clinicalOpinion: ''
    },
    { 
      id: 12, name: 'Leong Xian Jun', type: 'medication record', date: new Date('2020-4-16'), prescriptionID: 11,
      medications: []
    },
  ]

}

export type Record = {
  id: number
  name: string
  date: Date
} & ( 
  {
    type: 'health prescription'
    appID?: number // appointment id
    illness: string
    clinicalOpinion: string
  } | {
    type: 'medication record'
    prescriptionID: number
    medications: {
      medecine: string
      dosage: number
    } []
  } | {
    type: 'lab test result'
    appID: number // appointment id
    title: string
    data: { 
      field: string
      result: string
      normalRange: string
    }[]
  }
)

export default RecordConnection.instance