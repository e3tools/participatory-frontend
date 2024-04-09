import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native"; 
import { DashboardService } from '@/app/services/dashboard';
import AppLoader from '../shared/AppLoader'; 
 
export default function BarChart({ chart_id }) {   
    // See https://commerce.nearform.com/open-source/victory/docs
    const [chart_data, set_chart_data] = useState([]);
    const [loading, set_loading] = useState(true);
    useEffect(() => {
      DashboardService.get_chart_data(chart_id).then((data) => {
        //transform data
        let vals = [];  
        data.labels.forEach((label: string) => { 
            vals.push({ 'label': label, value: null });
        });
        data.datasets.forEach((itm) => {
            if(itm.name == chart_id){
            itm.values.forEach((val, idx) =>{
                vals[idx]['value'] = val 
            })
            }
        })  
        set_chart_data(vals); 
        set_loading(false);
    })  
    }, []);
    
  return ( 
    <View>
      { 
        (loading === false) ? (        
          <VictoryChart theme={VictoryTheme.material}>
              <VictoryBar data={chart_data} x="label" y="value" />
            </VictoryChart>        
        ) : <AppLoader />
      }
      </View> 
  )
}