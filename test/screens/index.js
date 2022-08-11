import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Table from './table';
import Graph from './graph';
import { useDispatch } from 'react-redux';
import defecation from '../datas/defecation.json'
import sleep from '../datas/sleep.json'
import { GET_DEFECATION_DATA, GET_SLEEP_DATA } from '../reducers/main';
import { useCallback, useEffect } from 'react';

const Tab = createMaterialTopTabNavigator()

const Index = () => {
    const dispatch = useDispatch()
  
    const refineData = useCallback((data,label)=>{
        return data.reduce((acc,cur,idx)=>{
            const key = cur.creationTime.split(' ')[0]
            if(!(key in acc)){
                acc[key] = [0,0]
            }
            acc[key][0] += +cur[label]
            acc[key][1] ++
            return acc
        },{})
    },[])

    useEffect(() => {
        const data = refineData(sleep,'sleep')

        const newSleep = []
        for(const key in data){
            const [sum,div] = data[key]
            newSleep.push([key,sum/div])
        }

        dispatch({
            type: GET_SLEEP_DATA,
            data: newSleep,
        })
    },[sleep])

    useEffect(() => {
        const data = refineData(defecation,'weight')
        console.log(data)
        const newDefecation = []
        for(const key in data){
            const [sum,count] = data[key]
            newDefecation.push([key,sum/count,count])
        }
        console.log(newDefecation)
        dispatch({
            type: GET_DEFECATION_DATA,
            data: newDefecation,
        })
    },[defecation])

    return(
        <>
            <StatusBar />
            <View style={styles.container}>
                <NavigationContainer styles={styles.container}>
                <Tab.Navigator 
                    initialRouteName='Graph'
                    screenOptions={{
                    tabBarActiveTintColor: '#FFFFFF',
                    tabBarLabelStyle: styles.tabText,
                    tabBarStyle: styles.tabHeader,
                    tabBarIndicatorStyle:styles.tabIndicator,
                    }}
                >
                    <Tab.Screen 
                    name='Graph' 
                    component={Graph} 
                    options={{
                        title:'그래프로 보기',
                    }}
                    />
                    <Tab.Screen
                    name='Table' 
                    component={Table} 
                    options={{
                        title:'표로 보기',
                    }}
                    />
                </Tab.Navigator>
                </NavigationContainer>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    tabHeader:{
      backgroundColor:'#FF6701',
    },
    tabText:{
      fontSize:20,
      fontWeight:'bold',
    },
    tabIndicator:{
      backgroundColor:'rgba(255, 255, 255, 0.5)',
      height:2
    },
  });

export default Index