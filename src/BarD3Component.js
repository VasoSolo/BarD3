import d3 from 'd3';
// import PropTypes from 'prop-types';

/*
  const propTypes = {
   data: PropTypes.shape({
    matrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    nodes: PropTypes.arrayOf(PropTypes.string),
  }), 
  width: PropTypes.number,
  height: PropTypes.number,
  colorScheme: PropTypes.string,
  numberFormat: PropTypes.string,
  
};
*/

/* function BarD3 (element, props) {
  const { data, width, height} = props;

  element.innerHTML = '';

  const div = d3.select(element);
  div.classed('bar-d3', true);
  const { nodes, matrix } = data;

  let bar;

  const svg = div
  .append('svg')
  .attr('width', 50)
  .attr('height', 50)
}
BarD3.displayName = 'BarD3';
BarD3.propTypes = propTypes;
export default BarD3; */

function BarD3 () {
  return <div>
    <span></span>
  </div>
}

export default BarD3;