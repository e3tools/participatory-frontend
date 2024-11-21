import { StyleProp, ViewStyle } from 'react-native'
import { LEGEND_TYPE } from '../constants/enums'

interface ILegendItem {
    operator: string
    item_type: typeof LEGEND_TYPE,
    // alphatext_value: string,
    // numeric_value: number,
    // date_value: Date,
    absolute_val: object,
    lower_val: object,
    upper_val: object,
    label: string,
    color: string
  }

  export {
    ILegendItem
  }

export interface IModalProps {
  children: React.ReactNode,
  visible: boolean,
  on_dismiss: () => void,
  title?: string
}
