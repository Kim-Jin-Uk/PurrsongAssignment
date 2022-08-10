import {StyleSheet, View, Dimensions, Text} from "react-native"
import {useSelector} from "react-redux"
import {useState,useEffect} from "react"
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview"

const Table = () => {
    const { defecationData,sleepData } = useSelector((state) => state);
    const [divTime, setDivTime] = useState(1)
    const [timeText,setTimeText] = useState('second')
    const unitToTime = {second:1,minute:10,hour:60*60}
    const [divWeight, setDivWeight] = useState(1)
    const [weightText,setWeightText] = useState('gram')
    const unitToWeight = {gram:1,kilogram:1000,pound:453.592}
    const [mergeData, setMergeData] = useState([])
    const [dataProvider, setDataProvider] = useState(new DataProvider((row1,row2) => row1!==row2))
    const [layoutProvider,setLayoutProvider] = useState(new LayoutProvider(
        (index)=>index,
        (type,dimension) => {
            dimension.width = 400
            dimension.height = 50
        }
    ))
    const rowRenderer = (type,[date,defecation,count,time]) => {
        return (
            <View style={styles.listItemWrapper}>
                <Text style={styles.listText}>{date}</Text>
                <Text style={styles.listText}>{defecation}</Text>
                <Text style={styles.listText}>{count}</Text>
                <Text style={styles.listText}>{time}</Text>
            </View>
        )
    }

    useEffect(()=>{
        const newMergeData = [['날짜','배변량','배변횟수','수면시간']]
        defecationData.forEach(([date,defecation,count],idx)=>{
            newMergeData.push([date,defecation.toFixed(2),count,sleepData[idx][1].toFixed(2)])
        })
        setMergeData(newMergeData)
    },[defecationData,sleepData])

    useEffect(()=>{
        const newDataProvider = new DataProvider((row1,row2) => row1 !== row2)
            .cloneWithRows(mergeData.map((v)=>[...v]).concat(mergeData.map((v)=>[...v])).concat(mergeData.map((v)=>[...v])).concat(mergeData.map((v)=>[...v])).concat(mergeData.map((v)=>[...v])).concat(mergeData.map((v)=>[...v])).concat(mergeData.map((v)=>[...v])))
        setDataProvider(newDataProvider)
    },[mergeData])

    useEffect(()=>{
        const width = Dimensions.get('window').width
        if(width) {
            setLayoutProvider(new LayoutProvider(
                (index) => index,
                (type, dimension) => {
                    dimension.width = width
                    dimension.height = 50
                }
            ))
        }
    },[Dimensions.get('window').width])

    return(
        <View style={styles.container}>
            <RecyclerListView layoutProvider={layoutProvider} rowRenderer={rowRenderer} dataProvider={dataProvider} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },
    listItemWrapper: {
        flexDirection:'row',
        height:'100%',
        borderLeftWidth:1,
    },
    listText: {
        flex:1,
        textAlign:'center',
        lineHeight:49,
        backgroundColor:'#d7d7d7',
        borderTopWidth:1,
        borderRightWidth:1,
        fontSize:15
    }
})

export default Table