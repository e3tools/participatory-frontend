// // import { BarChart as Chart} from "react-native-chart-kit";

// import { View, Text } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { CartesianChart, Bar } from 'victory-native';
// import { BarChartConfig } from "./_config";
// import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
// import { DashboardService } from 'services/dashboard';

// export function BarChart({ chart_id }) {
//     // const data = {
//     //     labels: ["January", "February", "March", "April", "May", "June"],
//     //     datasets: [
//     //       {
//     //         data: [20, 45, 28, 80, 99, 43]
//     //       }
//     //     ]
//     //   };
//     const data = [
//       { 'label': 'Jan', 'value': 20 },
//       { 'label': 'Feb', 'value': 30 },
//       { 'label': 'Mar', 'value': 40 },
//       { 'label': 'Apr', 'value': 50 },
//       { 'label': 'May', 'value': 60 },
//       { 'label': 'Jun', 'value': 70 },
//     ]
//     const [chart_data, set_chart_data] = useState([]);

//     useEffect(()=> {
//       // DashboardService.get_chart_data(chart_id).then((data) => {
//       //   //transform data
//       //   let vals = [];  
//       //   data.labels.forEach((label: string) => { 
//       //     vals.push({ 'label': label, value: null });
//       //   });
//       //   data.datasets.forEach((itm) => {
//       //     if(itm.name == chart_id){
//       //       itm.values.forEach((val, idx) =>{
//       //         vals[idx]['value'] = val 
//       //       })
//       //     }
//       //   })  
//       //   set_chart_data(vals);
//       //   //loading.value = false
//       // }) 
//     }, []);
//   return (
//     <View>
//       <CartesianChart
//         data={data}
//         xKey='label'
//         yKeys={['value']}
//         // 👇 Add domain padding to the chart to prevent the first and last bar from being cut off.
//         domainPadding={{ left: 50, right: 50, top: 30 }}
//       >
//         {({ points, chartBounds }) => (
//           <Bar
//             chartBounds={chartBounds}
//             points={points.value}
//             roundedCorners={{
//               topLeft: 5,
//               topRight: 5
//             }}
//           >
//             <linearGradient
//               start={vec(0,0)}
//               end={vec(0, 100)}
//               colors={["#a78bfa", "#a78bfa50"]}
//             />
//           </Bar>
//         )}
//       </CartesianChart>
//       <Text>BarChart</Text>
//       {/* <Chart
//         data={data}
//         chartConfig={BarChartConfig}
//         width={200}
//         height={200}
//         verticalLabelRotation={20}
//       /> */}
//     </View>
//   )
// }

// const MusicChart = () => {
//   const data = Array.from({ length: 6 }, (_, index) => ({
//     // Starting at 1 for Jaunary
//     month: index + 1,
//     // Randomizing the listen count between 100 and 50
//     listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
// }))
//  // const font = useFont(inter, 12) //👈 Create a font object with the font file and size.

//   return (
//     <CartesianChart
//       data={data}
//       /**
//        * 👇 the xKey should map to the property on data of you want on the x-axis
//        */
//       xKey="month"
//       /**
//        * 👇 the yKey is an array of strings that map to the data you want
//        * on the y-axis. In this case we only want the listenCount, but you could
//        * add additional if you wanted to show multiple song listen counts.
//        */
//       yKeys={["listenCount"]}>
//       {({ points, chartBounds }) => (
//         <Bar
//           chartBounds={chartBounds}  // 👈 chartBounds is needed to know how to draw the bars
//           points={points.listenCount} // 👈 points is an object with a property for each yKey
//         />
//       )}
//     </CartesianChart>
//   )
// }

// export { MusicChart }