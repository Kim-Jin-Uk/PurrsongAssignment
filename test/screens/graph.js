import { useEffect, useState } from "react"
import { Button, View, Dimensions, Text } from "react-native"
import defecation from '../datas/defecation.json'
import sleep from '../datas/sleep.json'
import { LineChart } from 'react-native-chart-kit'

const Graph = ({navigation, route}) => {
    const [defecationData,setDefecationData] = useState([['11111',1,1]])
    const [sleepData,setSleepData] = useState([['11111',1]])
   
    useEffect(() => {
        const data = sleep.reduce((acc,cur,idx)=>{
            const key = cur.creationTime.split(' ')[0]
            if(!(key in acc)){
                acc[key] = [0,0]
            }
            acc[key][0] += +cur.sleep
            acc[key][1] ++
            return acc
        },{})
        const newSleep = []
        for(const key in data){
            const [sum,div] = data[key]
            newSleep.push([key,sum/div])
        }
        setSleepData(newSleep)
    },[sleep])

    useEffect(() => {
        const data = defecation.reduce((acc,cur,idx)=>{
            const key = cur.creationTime.split(' ')[0]
            if(!(key in acc)){
                acc[key] = [0,0]
            }
            acc[key][0] += +cur.weight
            acc[key][1] ++
            return acc
        },{})
        const newDefecation = []
        for(const key in data){
            const [sum,count] = data[key]
            newDefecation.push([key,sum,count])
        }
        setDefecationData(newDefecation)
    },[defecation])

    return(
        <View>
            <View>
                <LineChart
                    data={{
                        labels: sleepData.map((v)=>v[0].substring(5)),
                        datasets: [{
                            data: sleepData.map((v)=>v[1]),
                            strokeWidth: 2,
                        },],
                    }}
                    width={Dimensions.get('window').width - 16}
                    height={320}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                />
                <Text>Second</Text>
            </View>
            <View>
                <LineChart
                    data={{
                        labels: defecationData.map((v)=>{
                            console.log(v[0],typeof(v[0]))
                            return v[0].substring(5)
                        }),
                        datasets: [{
                            data: defecationData.map((v)=>v[1]),
                            strokeWidth: 2,
                        },{
                            data: defecationData.map((v)=>v[2]),
                            strokeWidth: 2,
                        },],
                    }}
                    width={Dimensions.get('window').width - 16}
                    height={320}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                />
                <Text>Gram</Text>
            </View>
        </View>
    )
}

export default Graph