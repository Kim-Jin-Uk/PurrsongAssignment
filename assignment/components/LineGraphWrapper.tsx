import { LineChart } from 'react-native-chart-kit';
import {
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Text as TextSVG, Svg } from 'react-native-svg';

const LineGraph = (props: {
  origin: (string | number)[][]; // 원본 데이터
  title: string; // 그래프 제목
  data: number[]; // 그래프에 그릴 데이터
  buttonGroup: (string | number)[][] | null; // 단위 변환 버튼
  isFloat: boolean; // 실수 정수 여부
}) => {
  // 주차별로 보기위한 슬라이싱 인덱스
  const [startIdx, setStartIdx] = useState(props.data.length - 7);
  // 그래프에서 사용될 원본 데이터
  const [origin, setOrigin] = useState([] as (string | number)[][]);
  // 그래프에서 사용될 데이터
  const [data, setData] = useState([] as number[]);
  // 그래프 제목 > 단위, 주차에 따라 변경
  const [title, setTitle] = useState('');
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
    if (props.data.length <= 7) {
      setHasMoreRight(false);
      setHasMoreLeft(false);
    } else if (startIdx > props.data.length - 7) {
      // 인덱스 벗어났을 때 처리
      setStartIdx(props.data.length - 7);
      setHasMoreRight(false);
    } else if (startIdx === props.data.length - 7) {
      setHasMoreRight(false);
    } else if (startIdx === 0) {
      setHasMoreLeft(false);
    } else if (startIdx < 0) {
      // 인덱스 벗어났을 때 처리
      setStartIdx(0);
      setHasMoreLeft(false);
    } else {
      setHasMoreRight(true);
      setHasMoreLeft(true);
    }
  }, [startIdx, props.data]);
  // 슬라이싱 인덱스에 따라 원본 데이터, 그릴 데이터 가공
  useEffect(() => {
    if (startIdx >= 0) {
      setOrigin(props.origin.slice(startIdx, startIdx + 7));
      setData(props.data.slice(startIdx, startIdx + 7));
    }
  }, [props.origin, props.data, startIdx]);
  // 그래프 제목 갱신 - 주차, 단위에 따라 변경한다
  useEffect(() => {
    if (startIdx >= 0) {
      const targetArr = props.origin.slice(startIdx, startIdx + 7);
      const [start, end] = [targetArr[0], targetArr[targetArr.length - 1]];
      setTitle(
        `${props.title}${unitType && `(${unitType})`} - ( ${(
          start[0] as string
        ).substring(5)} - ${(end[0] as string).substring(5)} )`,
      );
    }
  }, [props.title, props.origin, startIdx, unitType]);
  // 단위 변경 버튼 초기화
  useEffect(() => {
    if (props.buttonGroup) {
      const [type, unit] = props.buttonGroup[0];
      setDiv(unit as number);
      setUnitType(type as string);
    }
  }, [props.buttonGroup]);

  // 이전 주차로 데이터 변경 함수
  const onPressMoreLeft = useCallback(() => {
    if (startIdx - 7 < 0) setStartIdx(0);
    else setStartIdx(startIdx - 7);
    setTooltipPos({ ...tooltipPos, visible: false });
  }, [startIdx, props.data.length, tooltipPos]);
  // 다음 주차로 데이터 변경 함수
  const onPressMoreRight = useCallback(() => {
    if (startIdx + 7 > props.data.length) setStartIdx(props.data.length);
    else setStartIdx(startIdx + 7);
    setTooltipPos({ ...tooltipPos, visible: false });
  }, [startIdx, props.data.length, tooltipPos]);
  // 단위 변경 함수
  const onPressUnitChange = useCallback(
    (unit: number, type: string) => {
      setDiv(unit);
      setUnitType(type);
      setTooltipPos({ ...tooltipPos, visible: false });
    },
    [props.buttonGroup, tooltipPos],
  );

  return (
    <>
      {/*제목*/}
      <View style={styles.titleWrapper}>
        {startIdx >= 0 && <Text style={styles.title}>{title}</Text>}
      </View>
      {/*그래프*/}
      <View style={styles.graphWrapper}>
        {hasMoreLeft ? (
          <TouchableOpacity
            style={styles.weekChangeButton}
            onPress={onPressMoreLeft}
          >
            <Text style={styles.weekChangeButtonText}>{'◀︎'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.weekChangeButton} />
        )}
        {origin.length > 0 && data.length > 0 && (
          <LineChart
            data={{
              labels: origin.map((v) => (v[0] as string).substring(5)),
              datasets: [
                {
                  data: data.map((v) => v / div),
                  strokeWidth: 3,
                },
                {
                  data: [Math.min(...data.map((v) => v / div)) * 0.9],
                  withDots: false,
                },
                {
                  data: [Math.max(...data.map((v) => v / div)) * 1.1],
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
                        {props.isFloat
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
              decimalPlaces: props.isFloat ? 2 : 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        )}
        {hasMoreRight ? (
          <TouchableOpacity
            style={styles.weekChangeButton}
            onPress={onPressMoreRight}
          >
            <Text style={styles.weekChangeButtonText}>{'▶︎'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.weekChangeButton} />
        )}
      </View>
      <View style={styles.unitChangeButtonWrapper}>
        {props.buttonGroup &&
          props.buttonGroup.map(([type, unit], i) => {
            return (
              <TouchableOpacity
                style={styles.unitChangeButton}
                onPress={() =>
                  onPressUnitChange(unit as number, type as string)
                }
                key={`${type}-${i}`}
              >
                <Text style={styles.unitChangeButtonText}>{type}</Text>
              </TouchableOpacity>
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
  weekChangeButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekChangeButtonText: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#FF6701',
  },
  unitChangeButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  unitChangeButton: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6701',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  unitChangeButtonText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFFFFF',
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
