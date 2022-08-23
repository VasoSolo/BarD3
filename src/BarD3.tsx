/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef } from "react";
import { styled } from "@superset-ui/core";
import { BarD3Props, BarD3StylesProps } from "./types";
import * as d3 from "d3";
// import BarD3Component from "./BarD3Component";

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<BarD3StylesProps>`
  background-color: ${({ theme }) => theme.colors.secondary.light2};
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

function BarD3Component() {
  const w = 500;
  const h = 300;
  const padding = 30;

  const svg = d3
    .select("slice_container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  return (
    <div className="test">
      <span>Hello</span>
    </div>
  );
}

export default function BarD3(props: BarD3Props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width } = props;

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

    const dataArray = [20, 40, 50, 60];
    //const width = 500;
    //const height = 500;
    const widthScale = d3.scaleLinear([0, 60], [0, width]);
    const color = d3.scaleLinear([0, 60], ["blue", "red"]);

    /* const svg2 = element.select("MyChart").node()
      ? element.select("svg")
      : element.append("svg").attr("width", 50).attr("height", 50); */

    console.log("isExist", element.select(".MyChart").node());
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
    const bars = canvas
      .selectAll("rect")
      .data(dataArray)
      .enter()
      .append("rect")
      .attr("fill", (d) => color(d))
      .attr("width", (d) => widthScale(d))
      .attr("height", 30)
      .attr("y", (d, i) => {
        return i * 50;
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
      <h3>{props.headerText}</h3>
      {/* <pre>${JSON.stringify(data, null, 2)}</pre> */}
    </Styles>
  );
}
