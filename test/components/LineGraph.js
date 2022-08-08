import { LineChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'
import FlashMessage, { showMessage } from "react-native-flash-message";
const LineGraph = (props) => {
    console.log(props)
    return(
        <>
        <FlashMessage duration={1000} />
        <LineChart
            data={{
                labels: props.origin.map((v)=>v[0].substring(5)),
                datasets: [{
                    data: props.data,
                    strokeWidth: 2,
                },],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            onDataPointClick={({ index, value, getColor }) =>
                showMessage({
                    message: `${value.toFixed(props.isFloat ? 2 : 0)}`,
                    description: `${props.origin[index][0].substring(2)}일 데이터 입니다`,
                    backgroundColor: getColor(0.5)
                })
            }
            chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: props.isFloat ? 2 : 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
        />
        </>
    )
}

export default LineGraph