import { StyleSheet, View, Text, Dimensions } from "react-native"
import { useSelector } from "react-redux"
import LineGraph from "../components/LineGraph"

const Graph = ({navigation, route}) => {
    const { defecationData,sleepData } = useSelector((state) => state);
    
    return(
        <View style={styles.container}>
            <View style={styles.graphView}>
                <LineGraph 
                    origin={sleepData} 
                    data={sleepData.map((v)=>v[1])} 
                    isFloat={true} 
                />
                <Text>Second</Text>
            </View>
            <View style={styles.graphView}>
                <LineGraph 
                    origin={defecationData} 
                    data={defecationData.map((v)=>v[1])} 
                    isFloat={true} 
                />
                <Text>Gram</Text>
            </View>
            <View style={styles.graphView}>
                <LineGraph 
                    origin={defecationData}
                    data={defecationData.map((v)=>v[2])} 
                    isFloat={false} 
                />
                <Text>Count</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    graphView:{
        flex:1
    }
  });

export default Graph