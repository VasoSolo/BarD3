import React, { useEffect, createRef } from "react";
import { callApi, styled } from "@superset-ui/core";
import { BarD3Props, BarD3StylesProps } from "./types";
import * as d3 from "d3";
import { schemeSet3, selectAll, transition } from "d3";

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<BarD3StylesProps>`
  //background-color: ${({ theme }) => theme.colors.secondary.light2};
  //padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
    font-size: ${({ theme, headerFontSize }) =>
      theme.typography.sizes[headerFontSize]}px;
    font-weight: ${({ theme, boldText }) =>
      theme.typography.weights[boldText ? "bold" : "normal"]};
  }

  pre {
    height: ${({ theme, headerFontSize, height }) =>
      height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]}px;
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function BarD3(props: BarD3Props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, cols, metrics } = props;

  const rootElem = createRef<HTMLDivElement>();
  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log("Plugin element", root);
    const element = d3.select(root);
    const metrica = metrics[0];
    const colName = cols[0];

    const dataGrouped = d3.group(
      data,
      //(d) => d.year,
      (d) => d[colName]
    );

    let Y = [];
    let dataArray = [];
    //console.log("dataGrouped ", dataGrouped);

    dataGrouped.forEach((value, key) => {
      Y.push(key);
      dataArray.push(value[0][metrica]);
    });
    console.log("dataArray", dataArray);
    console.log("Y", Y);

    const maximumInDateArray = d3.max(dataArray);
    const padding = 5;
    const paddingLeft = 40;
    const heightChart = height - padding * 5;
    const widthScale = d3.scaleLinear([0, maximumInDateArray], [0, width]);
    const heightRect = heightChart / dataArray.length - padding;
    //const color = d3.scaleLinear([0, maximumInDateArray], ["blue", "red"]);

    function calcY(d: any, i: number) {
      return Math.floor(heightChart / dataArray.length) * i;
    }

    if (element.select(".MyChart")) {
      element.select(".MyChart").remove();
    }
    const xAxis = d3.axisBottom(widthScale).ticks(10);
    const yAxis = d3.axisLeft(d3.scaleLinear(Y, [heightChart, 0]));

    const canvas = element
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "MyChart");

    //.attr("transform", "translate(0," + height + ")")

    const rectGroup = canvas
      .append("g")
      .attr("class", "rectGroup")
      .attr("height", heightChart)
      .attr("transform", "translate(" + paddingLeft + ", 0)");

    canvas
      .append("g")
      .attr("class", "Xaxis")
      .attr(
        "transform",
        "translate(" + paddingLeft + "," + (heightChart - 5) + ")"
      )
      .call(xAxis);

    const yAxisGroup = canvas // группа элементов оси У
      .append("g")
      .attr("class", "Yaxis")
      .attr("transform", "translate(" + paddingLeft + ",-5)");

    //yAxisGroup.call(yAxis);

    yAxisGroup //подписи по оси У
      .selectAll("text")
      .data(Y)
      .enter()
      .append("text")
      .attr("x", "-" + paddingLeft)
      .attr("y", (d, i) => {
        return calcY(d, i) + 19;
      })
      .text((d, i) => {
        return d;
      });

    const rect = rectGroup
      .selectAll("rect")
      .data(dataArray)
      .enter()
      .append("g")
      .attr("class", "rectItem")
      .append("rect")
      .attr("fill", "blue")
      .attr("width", 0)
      .attr("height", heightRect)
      .attr("y", (d, i) => {
        return calcY(d, i);
      });

    const text = rectGroup
      .selectAll(".rectItem")
      .append("text")
      .text((d: any) => d)
      .attr("fill", "gray")
      .attr("font-weight", "bold")
      .attr("x", (d: any) => widthScale(d) + 2)
      .attr("y", (d, i) => {
        return calcY(d, i) + (heightRect + 2 * padding) / 2;
      });

    // animation
    rect
      .transition()
      .attr("width", (d: any) => widthScale(d))
      .duration(1000);
    rect.on("mouseenter", function () {
      d3.select(this).transition().duration(300).attr("fill", "red");
      const parentGroup = d3.select(this).node().parentNode;
      parentGroup.querySelector("text").setAttribute("fill", "black");
    });
    rect.on("mouseleave", function () {
      d3.select(this).transition().duration(300).attr("fill", "blue");
      const parentGroup = d3.select(this).node().parentNode;
      parentGroup.querySelector("text").setAttribute("fill", "gray");
      //stroke="black" stroke-width="0.5
    });
  });

  console.log("Plugin props", props);

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      {/*<h3>{props.headerText}</h3>
       <pre>${JSON.stringify(data, null, 2)}</pre> */}
    </Styles>
  );
}
