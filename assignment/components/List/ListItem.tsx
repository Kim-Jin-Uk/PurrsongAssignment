import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const ListItem = (props: {
  date: string;
  weight: number | string;
  duration: number | string;
  count: number | string;
  time: number | string;
  weightStatus: string;
  durationStatus: string;
  countStatus: string;
  timeStatus: string;
}) => {
  const {
    date,
    weight,
    duration,
    count,
    time,
    weightStatus,
    durationStatus,
    countStatus,
    timeStatus,
  } = props;

  return (
    <View style={styles.listItemWrapper}>
      <Cell date={date} data={date} dataStatus={'date'} column={'날짜'}></Cell>
      <Cell
        date={date}
        data={weight}
        dataStatus={weightStatus}
        column={'배변량'}
      ></Cell>
      <Cell
        date={date}
        data={duration}
        dataStatus={durationStatus}
        column={'배변 시간'}
      ></Cell>
      <Cell
        date={date}
        data={count}
        dataStatus={countStatus}
        column={'배변 횟수'}
      ></Cell>
      <Cell
        date={date}
        data={time}
        dataStatus={timeStatus}
        column={'수면 시간'}
      ></Cell>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemWrapper: {
    flexDirection: 'row',
    height: '100%',
    borderLeftWidth: 1,
  },
});

export default ListItem;
