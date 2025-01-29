import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
//import { VictoryPie } from 'victory-pie';
import { VictoryPie } from 'victory-native';
import AppLoader from '../shared/app-loader';
import { barDataItem, pieDataItem, PieChart as PieGraph } from "react-native-gifted-charts";
import { theme, themeColorsArray } from '../theme/theme';

interface Props {
  data: pieDataItem[];
  showLegend?: boolean;
  showTotalInCenter?: boolean;
  title?: string;
}

export default function Donut(props: Props/*{ data: []}*/) {
    //See https://medium.com/wolox/how-to-animate-a-pie-chart-with-victory-in-react-native-db5997b991a5 on how to animate
    //See https://commerce.nearform.com/open-source/victory/docs
    /*
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
  )*/
 /*
  return ( 
      <PieGraph data={props.data} showText /> 
  );*/
  
  const [transformedData, setTransformedData] = useState<pieDataItem[]>([]);

  useEffect(() => {
    const data: pieDataItem[] = [];
    props.data.map((d, idx) => {
      const color = themeColorsArray[themeColorsArray.length - idx - 1] 
      // d.color = color;
      data.push(d)
    });
    setTransformedData(data);
  }, []);

  // console.log("Colors array: ", themeColorsArray)
  const COLORS = {
    mainBackground: theme.colors.primary,// themeColorsArray[0],
  };
  const renderLegend = (text: string, color: string) => {
        return (
          <View style={{flexDirection: 'row', marginBottom: 12}}>
            <View
              style={{
                height: 18,
                width: 18,
                marginRight: 10,
                borderRadius: 4,
                backgroundColor: color || 'white',
              }}
            />
            <Text style={{color: color || 'white', fontSize: 16}}>{text || ''}</Text>
          </View>
        );
      };
    
      return (
        <View>
          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 10,
              borderRadius: 10,
              paddingVertical: 10,
              // backgroundColor: COLORS.mainBackground,// '#414141',
              justifyContent: 'center',
              alignItems: 'center',
            }}>


            {/*********************    Custom Header component      ********************/}
            <Text
              style={{
                color: theme.colors.primary,// 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 12,
              }}>
              {props.title}
            </Text> 
            {/****************************************************************************/}


            <PieGraph
              strokeColor="white"
              strokeWidth={4}
              donut
              data={transformedData}
              // innerCircleColor="#414141"
              // innerCircleColor={COLORS.mainBackground}
              innerCircleBorderWidth={4}
              // innerCircleBorderColor={'white'}
              showValuesAsLabels={true}
              showText
              textSize={12}
              showTextBackground={true}
              centerLabelComponent={() => {
                return props.showTotalInCenter && (
                  <View> 
                    <Text style={{color: 'white', fontSize: 20}}>90</Text>
                    <Text style={{color: 'white', fontSize: 14}}>Total</Text>
                  </View>
                );
              }}
            />
            {/*********************    Custom Legend component      ********************/}
            {
              props.showLegend && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    marginTop: 20,
                  }}>
                    {
                      transformedData.map((d, idx) => {
                        const color = themeColorsArray[themeColorsArray.length - idx - 1]; 
                        return renderLegend(d.text || '', d.color || color);
                      })
                    }
                  {/* {renderLegend('Jan', 'rgb(84,219,234)')}
                  {renderLegend('Feb', 'lightgreen')}
                  {renderLegend('Mar', 'orange')} */}
                </View>
              )
            }
            {/****************************************************************************/}

            
          </View>
        </View>
      )
}