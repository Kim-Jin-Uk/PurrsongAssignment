import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback } from 'react';

type styleByTypeOptions = {
  [key: string]: TextStyle;
};

const Cell = (props: {
  date: string;
  data: string | number;
  dataStatus: string;
  column: string;
}) => {
  const { date, data, dataStatus, column } = props;
  const styleByType: styleByTypeOptions = {
    mid: styles.statusGreen,
    top: styles.statusRed,
    low: styles.statusRed,
    title: styles.statusTitle,
  };
  const onPressCell = useCallback(
    (status, value) => {
      let title = `${date}일 ${column}`;
      let message = '';
      if (status === 'title') {
        title = column;
        message = `하루의 ${
          column === '배변 횟수' ? '총' : '평균'
        } ${column} 입니다.`;
      } else if (status === 'mid') message = `${value} 이므로 평균입니다.`;
      else
        message = `${value} 이므로 평균(${column})보다 ${
          status === 'low' ? '낮습니다.' : '높습니다.'
        }`;
      Platform.OS === 'web'
        ? window.confirm([title, message].join('\n'))
        : Alert.alert(title, message, [{ text: '확인' }]);
    },
    [props],
  );
  return (
    <>
      {dataStatus === 'date' ? (
        <View style={styles.listCell}>
          <Text style={styles.listText}>{data}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.listCell}
          onPress={() => onPressCell(dataStatus, data)}
        >
          <Text style={[styles.listText, styleByType[dataStatus]]}>{data}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listCell: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: {
    textAlign: 'center',
    fontSize: 15,
  },
  statusGreen: {
    color: '#15bd00',
  },
  statusRed: {
    color: '#e13939',
  },
  statusTitle: {
    color: '#000000',
  },
});

export default Cell;
