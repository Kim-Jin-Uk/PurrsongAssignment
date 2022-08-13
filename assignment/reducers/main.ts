import { produce, Draft } from 'immer';
import { AnyAction } from 'redux';

export const initialSate = {
  defecationData: [],
  sleepData: [],
};

export const GET_DEFECATION_DATA = 'GET_DEFECATION_DATA';
export const GET_SLEEP_DATA = 'GET_SLEEP_DATA';

const rootReducer = (state = initialSate, action: AnyAction) =>
  produce(state, (draft: Draft<any>) => {
    switch (action.type) {
      case GET_DEFECATION_DATA:
        draft.defecationData = action.data;
        break;
      case GET_SLEEP_DATA:
        draft.sleepData = action.data;
        break;
      default:
    }
  });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export type defecationOriginData = {
  id: string;
  weight: string;
  duration: string;
  creationTime: string;
};
export type sleepOriginData = {
  id: string;
  sleep: string;
  creationTime: string;
};
