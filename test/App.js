import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native';
import Table from './screens/table';
import Graph from './screens/graph';

const Tab = createMaterialTopTabNavigator()

const App = () => {
  return (
    <>
      <SafeAreaView />
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
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  tabHeader:{
    backgroundColor:'#FF6701',
  },
  tabText:{
    fontSize:20,
    fontWeight:'bold',
  },
  tabIndicator:{
    backgroundColor:'#1F1F1F',
    height:2
  },
});

export default App