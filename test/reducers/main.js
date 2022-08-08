import { produce } from 'immer'

export const initialSate = {
    defecationData:[['dummy',1,1]],
    sleepData:[['dummy',1]]
}

export const GET_DEFECATION_DATA = 'GET_DEFECATION_DATA'
export const GET_SLEEP_DATA = 'GET_SLEEP_DATA'

export default (state=initialSate,action) => 
    produce(state,(draft)=>{
        switch (action.type) {
            case GET_DEFECATION_DATA:
                draft.defecationData = action.data
                break
            case GET_SLEEP_DATA:
                draft.sleepData = action.data
                break
            default:
        }
    })