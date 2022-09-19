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

export default function BarD3(props) {
  console.log("props", props);
  const {
    data,
    height,
    width,
    cols,
    metrics,
    hoverColor = "#e8463f",
    labelColor = "#254558",
    limitColor = "red",
    labelPosition = "end",
    labelFontSize = 14,
    xAxisFontSize = 14,
    yAxisFontSize = 14,
    xLimitLine = 100,
    paddingForChart = "5 5 0 0",
  } = props;
  const rootElem = createRef<HTMLDivElement>();
  function createChart(element) {
    let groupMode = false;
    if (cols.length > 1) {
      groupMode = true;
    }

    //обработка данных
    const metrica = metrics[0];
    const colName = cols[0];

    let dataGrouped;
    let arrayOfYItemLenght = [];
    let arrayOfAllValue = [];
    let arrayOfDifferentType = [];

    dataGrouped = Array.from(d3.group(data, (d) => d[cols[0]]));
    // console.log("dataGrouped_0", dataGrouped);
    if (cols.length > 1) {
      dataGrouped = dataGrouped.map((el) => {
        return [el[0], Array.from(d3.group(el[1], (d) => d[cols[1]]))];
      });
    }
    //console.log("dataGrouped_1", dataGrouped);
    if (cols.length == 3) {
      dataGrouped = dataGrouped.map((el) => {
        return [
          el[0],
          el[1].map((el2) => {
            return [el2[0], Array.from(d3.group(el2[1], (d) => d[cols[2]]))];
          }),
        ];
      });
    }
    //console.log("dataGrouped_2", dataGrouped);
    data.forEach((element) => {
      /* console.log("element", element);
        console.log("element[cols[0]]", element[cols[0]]);
        console.log("element[metric]", element[metrica]); */
      const str = element[cols[0]].toString();
      arrayOfYItemLenght.push(str.length);
      arrayOfAllValue.push(element[metrica]);
      arrayOfDifferentType.push(element[cols[cols.length - 1]]);
    });
    arrayOfDifferentType = Array.from(new Set(arrayOfDifferentType));
    let arrayLenghtGroups = [];
    if (cols.length > 1) {
      dataGrouped.forEach((element) => {
        //console.log("element in datagrouped.foreach", element);

        arrayLenghtGroups.push(element[1].length);
        if (cols.length === 3) {
          let arrayLenghtGroupsLevel2 = [];
          element[1].forEach((elementLevel2, index) => {
            arrayLenghtGroupsLevel2.push(elementLevel2[1].length);
          });
          arrayLenghtGroups.push([element[1].length, arrayLenghtGroupsLevel2]);
        } else {
          arrayLenghtGroups.push(element[1].length);
        }
      });
    }

    console.log("data", data);
    //console.log("arrayLenghtGroups", arrayLenghtGroups);
    console.log("dataGrouped", dataGrouped);
    console.log("arrayOfAllValue", arrayOfAllValue);
    console.log("arrayOfDifferentType", arrayOfDifferentType);

    ////////////////////////////////////////////////////////////////////////

    //вычисляем максимальное значение в метрике

    const maximumLenghtInY = d3.max(arrayOfYItemLenght); // находим самую длинную подпись слева
    const lenghtLeftTextScale = d3.scaleLinear([1, 20], [45, 100]);

    const maximumInDateArray = d3.max(arrayOfAllValue); // максимальное значение в данных
    const arrayOfPaddingValue = paddingForChart.split(" "); // переменная с настраиваемыми отступами
    const paddingLeft = lenghtLeftTextScale(maximumLenghtInY); // отступ слева
    console.log("paddingLeft", paddingLeft);
    const paddingRight = 200; // отстп справа
    const paddingBottom = 40; // отступ сверху
    const paddingBetweenGroups = 0; // отступ между группами
    const sumOfPadding = 45 + 80;
    const heightChart = height - paddingBottom; // высота области чарта, который мы рисуем
    const widthChart = width - paddingLeft; // ширина области чарта
    const paddingScale = d3.scaleLinear([0, heightChart], [0, 0]); // функция масштабирования отступов между прямоугольниками
    //const padding = paddingScale(heightChart / dataGrouped.length); // отступ между прямоугольниками
    const padding = 1; // отступ между прямоугольниками

    let heightRect = heightChart / arrayOfAllValue.length; // - padding; // высота прямоугольников
    heightRect = heightRect; // - padding; // высота прямоугольников
    const colorSets = [
      ["#680003", "#BC0000", "#F5704A", "#EFB9AD", "#828D00"],
      ["#338309", "#C9D46C", "#E48716", "#FAAB01", "#DFBCB2"],
      ["#6c585a", "#525d09", "#94aa6b", "#f39015", "#bb3701"],
      ["#1D0F0F", "#453C41", "#7B7C81", "#D4DBE2", "#7B586B"],
      ["#033540", "#015366", "#63898C", "#A7D1D2", "#E0F4F5"],
    ];

    const colorScale = d3
      .scaleOrdinal()
      .domain(arrayOfDifferentType)
      .range(colorSets[4]);
    //const colorScale = d3.scale
    const widthScale = d3.scaleLinear(
      [0, maximumInDateArray],
      [0, widthChart - paddingRight]
    );
    function labelPositionScale(h) {
      const heightScaleUniversal = d3.scaleLinear(
        [0, arrayOfAllValue.length],
        [0, h]
      );
      return heightScaleUniversal;
    }
    const heightScale = d3.scaleLinear(
      [0, arrayOfAllValue.length],
      [0, heightChart]
    );
    /* const heightInGroupOfRectScale = d3.scaleLinear( 
      [0, arrayOfDataArrayItemLenght],
      [0, heightGroupOfRect]
    ); */

    //const colorScale = d3.scaleLinear([0, arrayOfAllValue], ["blue", "red"]);

    function culcLabelPosition(d) {
      if (labelPosition === "end") {
        return widthScale(d) + 2;
      } else if (labelPosition === "middle") {
        return widthScale(d) / 2;
      } else if (labelPosition === "start") {
        return 2;
      }
    }

    if (element.select(".MyChart")) {
      element.select(".MyChart").remove();
    }

    const xAxis = d3.axisBottom(widthScale).ticks(10);
    const xAxisTicks = d3 //ось для сетки
      .axisBottom(widthScale)
      .tickSize(-heightChart)
      .ticks(10);
    //.tickFormat([]);
    ///////////////////////////////////////рисуем
    const canvas = element
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "MyChart")
      .attr(
        "style",
        "padding: " +
          arrayOfPaddingValue[0] +
          " " +
          arrayOfPaddingValue[1] +
          " " +
          arrayOfPaddingValue[2] +
          " " +
          arrayOfPaddingValue[3]
      );

    const xAxisTicksGroup = canvas // группа для сетки
      .append("g")
      .attr("class", "Xaxis")
      .attr("transform", "translate(" + paddingLeft + ", " + heightChart + ")");
    xAxisTicksGroup.call(xAxisTicks).style("opacity", "0.1");

    const xAxisGroup = canvas //группа  для оси х
      .append("g")
      .attr("class", "Xaxis")
      .attr("transform", "translate(" + paddingLeft + ", " + heightChart + ")");
    xAxisGroup.call(xAxis).style("font-size", xAxisFontSize);

    const yAxisGroup = canvas // группа элементов оси У
      .append("g")
      .attr("class", "Yaxis")
      .attr("margin-left", "auto")
      .attr("margin-right", 0);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //группа с прямоугольниками
    const rects = canvas
      .append("g")
      .attr("class", "rectCanvas") //rectGroup
      .attr("height", heightChart)
      .attr("width", widthChart)
      .attr("transform", "translate(" + paddingLeft + ", 0)");

    rects // ось У
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", heightChart)
      .attr("stroke-width", 1)
      .attr("stroke", "black");
    /////////////////////////////////////////////////////////////////////рисуем данные для группировок
    //let groupOfRect;
    let rect;
    let positionPrevBlock = 0;
    //const Y0 = Y.map((y) => y[0]);
    //Y.forEach((item, i) => {
    if (groupMode) {
      const groupOfRect = rects
        .selectAll(".groupOfRect")
        .data(dataGrouped)
        .enter()
        .append("g")
        .attr("class", "groupOfRect");

      groupOfRect.attr("transform", (d, i) => {
        //console.log("positionPrevBlock in groupOfRect", positionPrevBlock);
        let sum = 0;
        if (cols.length === 3) {
          d[1].forEach((el) => {
            sum += el[1].length;
          });
        }
        let height = sum > 0 ? sum * heightRect : d[1].length * heightRect;

        const res = positionPrevBlock;
        positionPrevBlock =
          sum > 0
            ? positionPrevBlock + height
            : positionPrevBlock + d[1].length * heightRect;
        positionPrevBlock += paddingBetweenGroups * 3;
        return "translate(0," + res + ")";
      });
      // подписи слева
      d3.selectAll(".groupOfRect")
        .append("text")
        .text((d) => {
          //console.log("d in text in groupOfRect", d);
          return d[0];
        })
        .attr("dy", (d) => (d[1].length * heightRect) / 2)
        .attr("dx", -40)
        .attr("class", "yAxisLabel");

      if (cols.length > 2) {
        //////////////////////////////////////////////////////////////////////in level 2

        /* console.log("groupOfRect.nodes()", groupOfRect.nodes());

        groupOfRect.nodes().forEach((node) => {
          console.log(node);
        }); */

        const groupOfRectNodes = groupOfRect.nodes();
        dataGrouped.forEach((element, i) => {
          //console.log(element[1]);
          createGroupLevel2(element[1], groupOfRectNodes[i]);
        });

        //////////////////////////////////////////////////////////////////////rect in level 2
        const groupOfRectLevelTwoNodes = d3.selectAll(".groupOfRectLevelTwo");

        let j = 0;
        dataGrouped.forEach((element) => {
          //console.log("element in dataGrouped.forEach for level 2", element);
          element[1].forEach((element2) => {
            createRect(
              element2[1],
              groupOfRectLevelTwoNodes.nodes()[j],
              false,
              false
            );
            j++;
          });
        });
      } else {
        //////////////////////////////////////////////////////////////////////rect in level 1
        const groupOfRectNodes = d3.selectAll(".groupOfRect");
        dataGrouped.forEach((element, i) => {
          createRect(element[1], groupOfRectNodes.nodes()[i], false, true);
        });
      }
    } else {
      createRect(dataGrouped, d3.select(".rectCanvas").node());
    }

    function createGroupLevel2(data, node) {
      //создание подгрупп второго уровня вложенности
      //console.log("inpute data in createGroupLevel2", data);
      //console.log("inpute node in createGroupLevel2", node);
      let positionPrevBlockIncreateGroupLevel2 = 0;
      d3.select(node)
        .selectAll(".groupOfRectLevelTwo")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "groupOfRectLevelTwo")
        .attr("height", (d) => {
          //console.log("d in level 2 in height", d[1]);
          return d[1].length * heightRect;
          //return 20;
        })
        .attr("transform", (d, i) => {
          /* console.log(
            "positionPrevBlock in transform in level 2",
            positionPrevBlock
          ); */
          const res = positionPrevBlockIncreateGroupLevel2;
          positionPrevBlockIncreateGroupLevel2 =
            positionPrevBlockIncreateGroupLevel2 +
            d[1].length * heightRect +
            paddingBetweenGroups;
          //console.log("res in transform", res);
          return "translate(0," + res + ")";
          //return "translate(0," + 50 * i + ")";
        });
    }

    function createRect(
      data,
      node,
      infoLabelIsVisible = true,
      valueLabelIsVisible = true
    ) {
      //функция создания прямоугольников
      //console.log("data inpute in createRect", data);
      //console.log("node inpute in createRect", node);
      const canvasInFuction = d3.select(node);
      const rectAndLabel = canvasInFuction //rects
        .selectAll("rectAndLabel")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "rectAndLabel");

      rect = rectAndLabel
        .append("rect")
        //.attr("fill", mainColor)
        .attr("fill", (d) => {
          return colorScale(d[0]);
        })
        //.attr("fill", "grey")
        .attr("opacity", "0.7")
        .attr("width", 0)
        .attr("height", heightRect)
        .attr("y", (d, i) => {
          //return heightRect * i;
          //console.log("d in create rect level 0", d);
          return heightScale(i);
        })
        .attr("class", "rectItem");

      if (infoLabelIsVisible) {
        rectAndLabel // infoLabel
          .append("text")
          .text((d) => {
            //console.log("d[0]", d[0]);
            return d[0];
          })
          .attr("y", (d, i) => {
            return heightScale(i);
          })
          .attr("font-size", yAxisFontSize)
          .attr("x", -10)
          .attr("text-anchor", "end")
          .attr("dy", (heightRect * 3) / 4)
          .attr("class", "infoLabel");
      }
      if (valueLabelIsVisible) {
        rectAndLabel // valueLabel
          .append("text")
          .text((d) => {
            //console.log("d", d[1][0][metrica]);
            return d[1][0][metrica];
          })
          .attr("y", (d, i) => {
            return heightScale(i);
          })
          .attr("font-size", labelFontSize)
          .attr("fill", labelColor)
          //.attr("x", (d) => widthScale(d[1][0][metrica]))
          .attr("x", (d) => culcLabelPosition(d[1][0][metrica]))
          .attr("text-anchor", "start")
          .attr("dy", (heightRect * 3) / 4)
          .attr("class", "valueLabel");
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    rects //пороговое значение
      .append("line")
      .attr("x1", widthScale(xLimitLine))
      .attr("y1", 0)
      .attr("x2", widthScale(xLimitLine))
      .attr("y2", heightChart)
      .attr("stroke-width", 4)
      .attr("stroke", limitColor)
      .attr("opacity", "0.15")
      .attr("class", "lineLimit");

    ////////////////////////////////////////////////////////////////////////create label
    if (labelPosition === "none") {
      d3.selectAll(".valueLabel").attr("opacity", "0");
    } else {
      d3.selectAll(".valueLabel")
        .transition()
        .attr("opacity", "1")
        .duration(1200);
    }
    //d3.selectAll(".rectItem").attr("height", heightRect - 3);
    //}
    //if (!groupMode) {
    ////////////////////////////////////////////////// animation
    d3.selectAll(".yAxisLabel").on("mouseenter", (el) => {
      d3.select(el.path[1])
        .selectAll(".rectItem")
        .transition()
        .duration(300)
        .attr("fill", "red");
      //console.log(el.path[1]);
    });
    d3.selectAll(".yAxisLabel").on("mouseleave", (el) => {
      d3.select(el.path[1])
        .selectAll(".rectItem")
        .transition()
        .duration(300)
        .attr("fill", (d) => colorScale(d[0]));
      //.attr("fill", "gray");
      //console.log(el.path[1]);
    });
    rects
      .selectAll(".rectItem")
      //rect
      .transition()
      .attr("width", (d) => {
        //console.log("d in transition", d[1][0][metrica]);
        //console.log("d[1][0][metrica]", d[1][0][metrica]);
        //widthScale(d[1][0][metrica]);
        //return widthScale(d);
        return Number(widthScale(d[1][0][metrica]));
        //return 150;
      })
      .duration(1000);
    rects.selectAll(".rectItem").on("mouseenter", function () {
      d3.select(this).transition().duration(300).attr("fill", hoverColor);
      const parentGroup = d3.select(this).node().parentNode;
      //parentGroup.querySelector("text").setAttribute("fill", labelHoverColor);
    });
    rects.selectAll(".rectItem").on("mouseleave", function () {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("fill", (d) => colorScale(d[0]));
      //.attr("fill", "green");
      const parentGroup = d3.select(this).node().parentNode;
      //parentGroup.querySelector("text").setAttribute("fill", labelColor);
    });
    //}
    //return element;
  }

  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    //console.log("Plugin element", root);
    const element = d3.select(root);
    createChart(element);
  }, [data]);

  //console.log("Plugin props", props);

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
