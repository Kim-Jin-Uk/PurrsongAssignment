import { Dimensions, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview';
import ListItem from '../components/List/ListItem';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers/main';

const Table = () => {
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((row1, row2) => row1 !== row2),
  );
  const [layoutProvider, setLayoutProvider] = useState(
    new LayoutProvider(
      (index) => index,
      (type, dimension) => {
        dimension.width = 400;
        dimension.height = 50;
      },
    ),
  );
  const [mergeData, setMergeData] = useState([] as (string | number)[][]);
  const { defecationData, sleepData } = useSelector(
    (state: RootState) => state,
  );
  const rowRenderer = (
    type: string | number,
    [
      date,
      weight,
      duration,
      count,
      time,
      weightStatus,
      durationStatus,
      countStatus,
      timeStatus,
    ]: string[],
  ) => {
    return (
      <ListItem
        date={date}
        weight={weight}
        duration={duration}
        count={count}
        time={time}
        weightStatus={weightStatus}
        durationStatus={durationStatus}
        countStatus={countStatus}
        timeStatus={timeStatus}
      ></ListItem>
    );
  };
  const makeMergeData = useCallback(() => {
    // 제목 행 생성
    const newMergeData: (string | number)[][] = [
      ['날짜', '배변량', '배변 시간', '배변 횟수', '수면 시간'],
    ];
    // 평균을 구하기 위한 길이 추출
    const len = defecationData.length;
    // 상한점
    let [maxWeight, maxDuration, maxCount, maxTime] = [0, 0, 0, 0];
    // 평균
    let [avrWeight, avrDuration, avrCount, avrTime] = [0, 0, 0, 0];
    // 하한점
    let [minWeight, minDuration, minCount, minTime] = [
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE,
    ];
    // 데이터 합치기 -> 배변데이터와 수면데이터의 개수는 동일하다 가정
    defecationData.forEach(([date, w, d, c]: (string | number)[], idx) => {
      // 숫자 타입을 확실시하기 위해 새 변수로 지정
      const [time, weight, duration, count] = [
        sleepData[idx][1],
        w,
        d,
        c,
      ] as number[];
      // 실수 데이터는 2자리까지만 표기, 날짜는 YY-MM-DD 형식
      newMergeData.push([
        date.toString().substring(2),
        +(weight as number).toFixed(2),
        +(duration as number).toFixed(2),
        count,
        +(time as number).toFixed(2),
      ]);
      // 상한, 하한, 평균 갱신
      maxWeight = Math.max(maxWeight, weight);
      maxDuration = Math.max(maxDuration, duration);
      maxCount = Math.max(maxCount, count);
      maxTime = Math.max(maxTime, time);
      minWeight = Math.min(minWeight, weight);
      minDuration = Math.min(minDuration, duration);
      minCount = Math.min(minCount, count);
      minTime = Math.min(minTime, time);
      avrWeight += weight;
      avrDuration += duration;
      avrCount += count;
      avrTime += time;
    });
    // 평균 갱신
    avrWeight /= len;
    avrDuration /= len;
    avrCount /= len;
    avrTime /= len;
    // 상한, 평균, 하한을 이용해 평균보다 높거나 낮은값을 평가할 기준 생성
    // 상태: (상한+평균)/2 보다 높으면 평소보다 높은 수치, (하한+평균)/2 보다 낮으면 평소보다 낮은 수치
    const [topWeight, topDuration, topCount, topTime] = [
      (maxWeight + avrWeight) / 2,
      (maxDuration + avrDuration) / 2,
      (maxCount + avrCount) / 2,
      (maxTime + avrTime) / 2,
    ];
    const [lowWeight, lowDuration, lowCount, lowTime] = [
      (minWeight + avrWeight) / 2,
      (minDuration + avrDuration) / 2,
      (minCount + avrCount) / 2,
      (minTime + avrTime) / 2,
    ];
    // 새 병합 데이터 리턴
    return newMergeData.map(([date, w, d, c, t]: (string | number)[], idx) => {
      if (idx === 0)
        return [date, w, d, c, t, 'title', 'title', 'title', 'title'];
      const [weight, duration, count, time] = [w, d, c, t] as number[];

      // 칼럼 순서에 맞춰 상태 갱신
      const statusData = [];
      // 배변량 칼럼
      if (weight > topWeight) {
        statusData.push('top');
      } else if (weight < lowWeight) {
        statusData.push('low');
      } else statusData.push('mid');

      // 배변 시간 칼럼
      if (duration > topDuration) {
        statusData.push('top');
      } else if (duration < lowDuration) {
        statusData.push('low');
      } else statusData.push('mid');

      // 배변 횟수 칼럼
      if (count > topCount) {
        statusData.push('top');
      } else if (count < lowCount) {
        statusData.push('low');
      } else statusData.push('mid');

      // 수면 시간 칼럼
      if (time > topTime) {
        statusData.push('top');
      } else if (time < lowTime) {
        statusData.push('low');
      } else statusData.push('mid');

      return [date, weight, duration, count, time].concat(statusData);
    });
  }, [defecationData, sleepData]);

  useEffect(() => {
    setMergeData(makeMergeData());
  }, [defecationData, sleepData]);
  useEffect(() => {
    const newDataProvider = new DataProvider(
      (row1, row2) => row1 !== row2,
    ).cloneWithRows(mergeData);
    setDataProvider(newDataProvider);
  }, [mergeData]);
  useEffect(() => {
    const width = Dimensions.get('window').width;
    if (width) {
      setLayoutProvider(
        new LayoutProvider(
          (index) => index,
          (type, dimension) => {
            dimension.width = width;
            dimension.height = 50;
          },
        ),
      );
    }
  }, [Dimensions.get('window').width]);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <RecyclerListView
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        dataProvider={dataProvider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#000000',
  },
});

export default Table;
