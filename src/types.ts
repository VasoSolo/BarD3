import { QueryFormData, supersetTheme, TimeseriesDataRecord } from '@superset-ui/core';
// import { ColorSchemeConfig } from '@superset-ui/core/lib/color/ColorScheme';

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
    cols: string[];
    metrics: string[];
    hoverColor: string,
    labelColor: string,
    limitColor: string,
    labelPosition: string,
    labelForStackedPosition: string,
    labelFontSize: number,
    xAxisFontSize: number,
    yAxisFontSize: number,
    xLimitLine: number,
    paddingForChart: string,
    paddingRight : number,
    paddingLeft: number,
    paddingTop: number,
    paddingBottom: number,
    paddingInfoLabel: number,
    legendX: number,
    legendY: number,
    orientation: string,
    visualGroupMode: string,
    colorScheme:string,
    paddingStackedGroup: number,
    paddingStackedGroupLevelTwo:number,
    // add typing here for the props you pass in from transformProps.ts!
  };
