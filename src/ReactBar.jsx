import React from "react";
import { reactify, styled } from "@superset-ui/core";
import PropTypes from "prop-types";
import Component from "./BarD3Component";

const ReactComponent = reactify(Component);

const Bar = ({ className/* , ...otherProps */ }) => (
  <div className={className}>
    <ReactComponent /* {...otherProps} */ />
  </div>
);

/* Bar.defaultProps = {
  otherProps: {},
}; */

/* Bar.propTypes = {
  className: PropTypes.string.isRequired,
  otherProps: PropTypes.objectOf(PropTypes.any),
}; */

export default styled(Bar);
/* `
  ${({ theme }) => `
    .superset-legacy-chart-chord svg #circle circle {
      fill: none;
      pointer-events: all;
    }
    .superset-legacy-chart-chord svg .group path {
      fill-opacity: ${theme.opacity.mediumHeavy};
    }
    .superset-legacy-chart-chord svg path.chord {
      stroke: ${theme.colors.grayscale.dark2};
      stroke-width: 0.25px;
    }
    .superset-legacy-chart-chord svg #circle:hover path.fade {
      opacity:  ${theme.opacity.light};
    }
  `}
`; */
