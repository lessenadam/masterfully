"use strict"

var React = require('react');
var ReactDOM = require('react-dom');
// var Chart = require('react-d3-core').Chart;
// var LineChart = require('react-d3-basic').LineChart;
// import rd3 from 'rd3';
// var LineChart = rd3.LineChart;
import $ from 'jquery';


export default class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: this.props.data,
      width: 800,
      height: 400,
      chartId: 'v1_chart',
    };
  }

  componentDidMount() {
    console.log('this.props.data is: ', this.state.chartData);    
    console.log('this.props.plainData is: ', this.state.plainData);
    // this.setState({
    //   width:this.props.width
    // })

  } 

  render() {
    var margin = {top: 5, right: 50, bottom: 20, left: 50},
        w = this.state.width - (margin.left + margin.right),
        h = this.state.height - (margin.top + margin.bottom);

    var x = d3.scale.linear()
        .domain([0,d3.max(this.state.chartData,function(d){
            return d.index+4;
        })])
        .rangeRound([0, w]);
 
    // updated!
    var y = d3.scale.linear()
        .domain([0,d3.max(this.state.chartData,function(d){
            return d.score+4;
        })])
        .range([h, 0]);

    // updated!
    var line = d3.svg.line()
        .x(function (d) {
            console.log('index: ',d.index);
            console.log('score: ',d.score);

            return x(d.index);
        })
        .y(function (d) {
            return y(d.score);
        }).interpolate('cardinal');

    var transform='translate(' + margin.left + ',' + margin.top + ')';

    return (
          <div>
            <svg id={this.props.chartId} width={this.state.width} height={this.state.height}>
              <g transform={transform}>
                <path className="session-line session-shadow" d={line(this.state.chartData)} strokeLinecap="round"/>
                <Dots data={this.state.chartData} x={x} y={y}/>
              </g>
            </svg>
          </div>
        );
  }
};

var Dots = (props) => {
  var _self=this;
 
        //remove last & first point
  var data=props.data.splice(1);
  data.pop();

  var circles=data.map(function(d,i){

    return (<circle className="dot" r="7" cx={props.x(d.index)} cy={props.y(d.score)} fill="#7dc7f4" stroke="#3f5175" strokeWidth="5px" key={i} />);
  });

  return(
      <g>
        {circles}
      </g>
  );
};

