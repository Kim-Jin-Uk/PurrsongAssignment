import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import LineGraph from '../components/LineGraphWrapper';
import { RootState } from '../reducers/main';

const Graph = () => {
  const { defecationData, sleepData } = useSelector(
    (state: RootState) => state,
  );

  return (
    <ScrollView style={styles.container}>
      {sleepData.length > 0 && defecationData.length > 0 && (
        <>
          <LineGraph
            title={'수면시간'}
            origin={sleepData}
            data={sleepData.map((v) => v[1] as number)}
            buttonGroup={[
              ['s', 1],
              ['m', 60],
              ['h', 60 * 60],
            ]}
            isFloat={true}
          />
          <LineGraph
            title={'배변량'}
            origin={defecationData}
            data={defecationData.map((v) => v[1] as number)}
            buttonGroup={[
              ['g', 1],
              ['kg', 1000],
              ['lb', 453.592],
            ]}
            isFloat={true}
          />
          <LineGraph
            title={'배변시간'}
            origin={defecationData}
            data={defecationData.map((v) => v[2] as number)}
            buttonGroup={null}
            isFloat={true}
          />
          <LineGraph
            title={'배변횟수'}
            origin={defecationData}
            data={defecationData.map((v) => v[3] as number)}
            buttonGroup={null}
            isFloat={false}
          />
          <View style={styles.footer} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    marginBottom: 10,
  },
});

export default Graph;
