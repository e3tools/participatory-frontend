import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
//import { VictoryPie } from 'victory-pie';
import { VictoryPie } from 'victory-native';
import AppLoader from '../shared/AppLoader';

export default function PieChart(/*{ data: []}*/) {
    //See https://medium.com/wolox/how-to-animate-a-pie-chart-with-victory-in-react-native-db5997b991a5 on how to animate
    //See https://commerce.nearform.com/open-source/victory/docs
    const data = [{ y: 10 }, { y: 50 }, { y: 40 }];
    const default_data = [{ y: 0 }, { y: 0 }, { y: 100 }];
    const colors = ['#388087', '#6fb3b8', '#badfe7'];
    const [chart_data, set_chart_data] = useState(default_data);
    const [loading, set_loading] = useState(true);

    useEffect(() => {
        set_chart_data(data);
        set_loading(false);
    }, []);

  return (
    <View>
      {
        !loading ? <VictoryPie 
          animate={{ easing: 'exp'}}
          data={chart_data}
          // width={200}
          // height={200}
          colorScale={colors}
          innerRadius={50}
        /> : <AppLoader />
      }
    </View>
  )
}