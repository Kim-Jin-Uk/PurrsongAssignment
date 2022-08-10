import { useCallback, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native"
import { useSelector } from "react-redux"
import LineGraph from "../components/LineGraph"

const Graph = () => {
    const { defecationData,sleepData } = useSelector((state) => state);
    const [divTime, setDivTime] = useState(1)
    const [timeText,setTimeText] = useState('second')
    const unitToTime = {second:1,minute:10,hour:60*60}
    const [divWeight, setDivWeight] = useState(1)
    const [weightText,setWeightText] = useState('gram')
    const unitToWeight = {gram:1,kilogram:1000,pound:453.592}

    const onClickSetTimeButton = useCallback((unitType) => {
        setDivTime(unitToTime[unitType])
        setTimeText(unitType)
    },[])

    const onClickSetWeightButton = useCallback((unitType) => {
        setDivWeight(unitToWeight[unitType])
        setWeightText(unitType)
    },[])

    return(
        <View style={styles.container}>
            <View style={styles.graphView}>
                <LineGraph 
                    origin={sleepData} 
                    data={sleepData.map((v)=>v[1]/divTime)} 
                    isFloat={true} 
                />
                <View style={styles.view}>
                    <Text style={styles.stateText}>{timeText}</Text>
                    <View style={styles.buttonWrapper}>
                        <View style={styles.buttonView} >
                            <TouchableOpacity style={styles.button} onPress={()=>onClickSetTimeButton('second')}>
                                <Text style={styles.buttonText}>toSecond</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonView} >
                            <TouchableOpacity style={styles.button} onPress={()=>onClickSetTimeButton('minute')}>
                                <Text style={styles.buttonText}>toMinute</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonView} >
                            <TouchableOpacity style={styles.button} onPress={()=>onClickSetTimeButton('hour')}>
                                <Text style={styles.buttonText}>toHour</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.graphView}>
                <LineGraph 
                    origin={defecationData} 
                    data={defecationData.map((v)=>v[1]/divWeight)} 
                    isFloat={true} 
                />
                <View style={styles.view}>
                    <Text style={styles.stateText}>{weightText}</Text>
                    <View style={styles.buttonWrapper}>
                        <View style={styles.buttonView} >
                            <TouchableOpacity style={styles.button} onPress={()=>onClickSetWeightButton('gram')}>
                                <Text style={styles.buttonText}>toGram</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonView} >
                            <TouchableOpacity style={styles.button} onPress={()=>onClickSetWeightButton('kilogram')}>
                                <Text style={styles.buttonText}>toKiloGram</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonView} >
                            <TouchableOpacity style={styles.button} onPress={()=>onClickSetWeightButton('pound')}>
                                <Text style={styles.buttonText}>toPound</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.graphView}>
                <LineGraph 
                    origin={defecationData}
                    data={defecationData.map((v)=>v[2])} 
                    isFloat={false} 
                />
                 <View style={styles.view}>
                    <Text style={styles.stateText}>count</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFFFFF',
        paddingTop:20
    },
    graphView:{
        flex:1
    },
    view:{
        flex:1
    },
    stateText:{
        alignSelf:'center',
        fontSize:20,
        fontWeight:'bold',
        marginBottom:5,
        marginTop:5
    },
    buttonWrapper:{
        flexDirection:'row',
        justifyContent:'space-around',
        flex:1,
        marginBottom:10
    },
    buttonView:{
        flexGrow:1,
        flexBasis:0,
        marginLeft:10,
        marginRight:10,
    },
    button:{
        width:'100%',
        height:30,
        backgroundColor:'#FF6701',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    buttonText:{
        fontSize:20,
        fontWeight:'normal',
        color:'white'
    }
  });

export default Graph