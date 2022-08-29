import React, { useEffect, createRef } from "react";
import { styled } from "@superset-ui/core";
import { BarD3Props, BarD3StylesProps } from "./types";
import * as d3 from "d3";
import { schemeSet3, transition } from "d3";

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<BarD3StylesProps>`
  //background-color: ${({ theme }) => theme.colors.secondary.light2};
  padding: ${({ theme }) => theme.gridUnit * 4}px;
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
  const { /* data, */ height, width } = props;

  const rootElem = createRef<HTMLDivElement>();
  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log("Plugin element", root);

    const element = d3.select(root);

    /*   "year": 1988,
    "count": 15
  },
  {
    "year": 1995,
    "count": 219
  },
  {
    "year": 1992,
    "count": 43
  },
  {
    "year": null,
    "count": 271
  },
  {
    "year": 2008,
    "count": 1428 */

    const dataArray = [20, 15, 35, 20, 55, 5, 19, 40, 50, 60];
    //const width = 500;
    //const height = 500;
    const padding = 5;
    const widthScale = d3.scaleLinear([0, 60], [0, width]);
    const color = d3.scaleLinear([0, 60], ["blue", "red"]);

    /* const svg2 = element.select("MyChart").node()
      ? element.select("svg")
      : element.append("svg").attr("width", 50).attr("height", 50); */

    if (element.select(".MyChart")) {
      element.select(".MyChart").remove();
    }

    const canvas = element
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "MyChart")
      .append("g")
      .attr("transform", "translate(20,0)");

    function calcY(d: any, i: number) {
      return Math.floor(height / dataArray.length) * i;
    }

    const heightRect = height / dataArray.length - padding;

    const rect = canvas
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

    const text = canvas
      .selectAll(".rectItem")
      .append("text")
      .text((d: any) => d)
      .attr("x", 20)
      .attr("y", (d, i) => {
        return calcY(d, i) + (heightRect + 2 * padding) / 2;
      });

    rect
      .transition()
      .attr("width", (d) => widthScale(d))
      .duration(1000);
    rect.on("mouseenter", function () {
      //d3.select(this).node().parentNode
      d3.select(this).transition().duration(300).attr("fill", "red");
      //d3.select(this).select("text").attr("fill", "white");

      //d3.select(this.parentNode)
      console.log(d3.select(this).node().parentNode);

      /* const parent = child.select(function() {
        return this.closest(".parent");  // Get the closest parent matching the selector string.
      }); */
    });
    rect.on("mouseleave", function () {
      d3.select(this).transition().duration(300).attr("fill", "blue");
    });
    //console.log("data", data);

    //console.log("isExistClass", d3Root.select("MyChart").node());
    /* const svg2 = element.select("MyChart").node()
      ? element.select("svg")
      : element.append("svg").attr("width", 50).attr("height", 50); */
  });

  console.log("Plugin props", props);

  //const el = d3.select("div.test").append("h3").text("hello");

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
