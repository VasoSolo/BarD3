import { QueryFormData, supersetTheme, TimeseriesDataRecord } from '@superset-ui/core';

export interface BarD3StylesProps {
  height: number;
  width: number;
  headerFontSize: keyof typeof supersetTheme.typography.sizes;
  boldText: boolean;
}

interface BarD3CustomizeProps {
  headerText: string;
}

export type BarD3QueryFormData = QueryFormData &
  BarD3StylesProps &
  BarD3CustomizeProps;

export type BarD3Props = BarD3StylesProps &
  BarD3CustomizeProps & {
    data: TimeseriesDataRecord[];
    // add typing here for the props you pass in from transformProps.ts!
  };
