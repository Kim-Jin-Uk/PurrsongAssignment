import { StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Table from './table';
import Graph from './graph';
import { useDispatch } from 'react-redux';
import defecation from '../datas/defecation.json';
import sleep from '../datas/sleep.json';
import {
  defecationOriginData,
  GET_DEFECATION_DATA,
  GET_SLEEP_DATA,
  sleepOriginData,
} from '../reducers/main';
import { useCallback, useEffect } from 'react';

const Tab = createMaterialTopTabNavigator();

interface refineDataObject {
  [key: string]: number[];
}

const Index = () => {
  const dispatch = useDispatch();

  const refineSleepData = useCallback((data: sleepOriginData[]) => {
    return data.reduce((acc: refineDataObject, cur: sleepOriginData) => {
      const key = cur.creationTime.split(' ')[0];
      if (!(key in acc)) {
        acc[key] = [0, 0];
      }
      acc[key][0] += +cur.sleep;
      acc[key][1]++;
      return acc;
    }, {});
  }, []);

  const refineDefecationData = useCallback((data: defecationOriginData[]) => {
    return data.reduce((acc: refineDataObject, cur: defecationOriginData) => {
      const key = cur.creationTime.split(' ')[0];
      if (!(key in acc)) {
        acc[key] = [0, 0, 0];
      }
      acc[key][0] += +cur.weight;
      acc[key][1] += +cur.duration;
      acc[key][2]++;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const data = refineSleepData(sleep);

    const newSleep = [];
    for (const key in data) {
      const [sum, div] = data[key];
      newSleep.push([key, sum / div]);
    }

    dispatch({
      type: GET_SLEEP_DATA,
      data: newSleep,
    });
  }, [sleep]);

  useEffect(() => {
    const data = refineDefecationData(defecation);

    const newDefecation = [];
    for (const key in data) {
      const [weight, duration, count] = data[key];
      newDefecation.push([key, weight / count, duration / count, count]);
    }

    dispatch({
      type: GET_DEFECATION_DATA,
      data: newDefecation,
    });
  }, [defecation]);

  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Graph"
          screenOptions={{
            tabBarActiveTintColor: '#FFFFFF',
            tabBarLabelStyle: styles.tabText,
            tabBarStyle: styles.tabHeader,
            tabBarIndicatorStyle: styles.tabIndicator,
          }}
        >
          <Tab.Screen
            name="Graph"
            component={Graph}
            options={{
              title: '그래프로 보기',
            }}
          />
          <Tab.Screen
            name="Table"
            component={Table}
            options={{
              title: '표로 보기',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  tabHeader: {
    backgroundColor: '#FF6701',
  },
  tabText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 2,
  },
});

export default Index;
