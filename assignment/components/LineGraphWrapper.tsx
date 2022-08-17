import { LineChart } from 'react-native-chart-kit';
import { Text, Dimensions, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Text as TextSVG, Svg } from 'react-native-svg';
import TextButton from './Button/textButton';
import DefaultButton from './Button/defaultButton';

const LineGraph = (props: {
  origin: (string | number)[][]; // 원본 데이터
  title: string; // 그래프 제목
  data: number[]; // 그래프에 그릴 데이터
  buttonGroup: (string | number)[][] | null; // 단위 변환 버튼
  isFloat: boolean; // 실수 정수 여부
}) => {
  const { origin, title, data, buttonGroup, isFloat } = props;
  // 주차별로 보기위한 슬라이싱 인덱스
  const [startIdx, setStartIdx] = useState(data.length - 7);
  // 그래프에서 사용될 원본 데이터
  const [graphOrigin, setGraphOrigin] = useState([] as (string | number)[][]);
  // 그래프에서 사용될 데이터
  const [graphData, setGraphData] = useState([] as number[]);
  // 그래프 제목 > 단위, 주차에 따라 변경
  const [graphTitle, setGraphTitle] = useState('');
  // 다음 주차 존재 여부
  const [hasMoreRight, setHasMoreRight] = useState(false);
  // 이전 주차 존재 여부
  const [hasMoreLeft, setHasMoreLeft] = useState(true);
  // 단위계산을 위한 나눗셈 변수
  const [div, setDiv] = useState(1);
  // 단위의 타입
  const [unitType, setUnitType] = useState('');
  // 툴팁을 띄울 객체
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  // 슬라이싱 인덱스에 따라 다음, 이전 주차 존재 여부 갱신
  useEffect(() => {
    // 데이터 셋의 길이가 7이하면 이전, 다음 주차는 없다
    if (data.length <= 7) setHasMoreLeftRight(false, false);
    else if (startIdx === data.length - 7) setHasMoreLeftRight(true, false);
    else if (startIdx === 0) setHasMoreLeftRight(false, true);
    else setHasMoreLeftRight(true, true);
  }, [startIdx]);
  // 슬라이싱 인덱스에 따라 원본 데이터, 그릴 데이터 가공
  useEffect(() => {
    setGraphOrigin(origin.slice(startIdx, startIdx + 7));
    setGraphData(data.slice(startIdx, startIdx + 7));
  }, [startIdx]);
  // 그래프 제목 갱신 - 주차, 단위에 따라 변경한다
  useEffect(() => {
    const targetArr = origin.slice(startIdx, startIdx + 7);
    const [start, end] = [targetArr[0], targetArr[targetArr.length - 1]];
    setGraphTitle(
      `${title}${unitType && `(${unitType})`} - ( ${(
        start[0] as string
      ).substring(5)} - ${(end[0] as string).substring(5)} )`,
    );
  }, [startIdx, unitType]);
  // 단위 변경 버튼 초기화
  useEffect(() => {
    if (buttonGroup) {
      const [type, unit] = buttonGroup[0];
      setDiv(unit as number);
      setUnitType(type as string);
    }
  }, []);

  // 이전 주차로 데이터 변경 함수
  const onPressMoreLeft = useCallback(() => {
    if (startIdx - 7 < 0) setStartIdx(0);
    else setStartIdx(startIdx - 7);
    setTooltipPos({ ...tooltipPos, visible: false });
  }, [startIdx, tooltipPos]);
  // 다음 주차로 데이터 변경 함수
  const onPressMoreRight = useCallback(() => {
    if (startIdx + 7 > data.length - 7) setStartIdx(data.length - 7);
    else setStartIdx(startIdx + 7);
    setTooltipPos({ ...tooltipPos, visible: false });
  }, [startIdx, tooltipPos]);
  // 단위 변경 함수
  const onPressUnitChange = useCallback(
    (unit: number, type: string) => {
      setDiv(unit);
      setUnitType(type);
      setTooltipPos({ ...tooltipPos, visible: false });
    },
    [buttonGroup, tooltipPos],
  );
  const setHasMoreLeftRight = useCallback((left: boolean, right: boolean) => {
    setHasMoreLeft(left);
    setHasMoreRight(right);
  }, []);

  return (
    <>
      <View style={styles.titleWrapper}>
        {startIdx >= 0 && <Text style={styles.title}>{graphTitle}</Text>}
      </View>
      <View style={styles.graphWrapper}>
        {hasMoreLeft ? (
          <TextButton text={'◀︎︎'} onPress={onPressMoreLeft} />
        ) : (
          <TextButton text={undefined} onPress={undefined} />
        )}
        {graphOrigin.length > 0 && graphData.length > 0 && (
          <LineChart
            data={{
              labels: graphOrigin.map((v) => (v[0] as string).substring(5)),
              datasets: [
                {
                  data: graphData.map((v) => v / div),
                  strokeWidth: 3,
                },
                {
                  data: [
                    isFloat
                      ? Math.min(...graphData.map((v) => v / div)) * 0.9
                      : Math.min(...graphData.map((v) => v / div)) - 1,
                  ],
                  withDots: false,
                },
                {
                  data: [
                    isFloat
                      ? Math.max(...graphData.map((v) => v / div)) * 1.1
                      : Math.max(...graphData.map((v) => v / div)) + 1,
                  ],
                  withDots: false,
                },
              ],
            }}
            width={Dimensions.get('window').width - 80}
            height={200}
            decorator={() => {
              return (
                tooltipPos.visible && (
                  <View>
                    <Svg>
                      <TextSVG
                        x={tooltipPos.x}
                        y={tooltipPos.y + 20}
                        fill="#FF6701"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {isFloat
                          ? tooltipPos.value.toFixed(2)
                          : tooltipPos.value}
                      </TextSVG>
                    </Svg>
                  </View>
                )
              );
            }}
            onDataPointClick={(data) => {
              const isSamePoint =
                tooltipPos.x === data.x && tooltipPos.y === data.y;
              isSamePoint
                ? setTooltipPos((previousState) => {
                    return {
                      ...previousState,
                      value: data.value,
                      visible: !previousState.visible,
                    };
                  })
                : setTooltipPos({
                    x: data.x,
                    value: data.value,
                    y: data.y,
                    visible: true,
                  });
            }}
            chartConfig={{
              backgroundColor: 'rgba(0, 0, 0, 0.0)',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        )}
        {hasMoreRight ? (
          <TextButton text={'▶︎'} onPress={onPressMoreRight} />
        ) : (
          <TextButton text={undefined} onPress={undefined} />
        )}
      </View>
      <View style={styles.unitChangeButtonWrapper}>
        {buttonGroup &&
          buttonGroup.map(([type, unit], i) => {
            return (
              <DefaultButton
                key={`${type}-${i}`}
                text={type as string}
                onPress={() =>
                  onPressUnitChange(unit as number, type as string)
                }
              ></DefaultButton>
            );
          })}
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  graphWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitChangeButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#FF6701',
    marginTop: 20,
  },
  tooltipBox: {
    width: 100,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
});

export default LineGraph;
