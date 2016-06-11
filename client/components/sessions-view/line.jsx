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
      tooltip:{ display:false,data:{key:'',value:''}}
    };
  }

  componentDidMount() {
    // this.setState({
    //   width:this.props.width
    // })

  } 

  showToolTip(e) {
    e.target.setAttribute('fill', '#FFFFFF');
 
    // this.setState({tooltip:
    //   {
    //     display:true,
    //     data: {
    //         key:e.target.getAttribute('data-key'),
    //         value:e.target.getAttribute('data-value')
    //         },
    //     pos:{
    //         x:e.target.getAttribute('cx'),
    //         y:e.target.getAttribute('cy')
    //     }
    //   }
    // }); 
  }
  
  hideToolTip(e) {
    e.target.setAttribute('fill', '#7dc7f4');
    // this.setState({tooltip:
    //   { 
    //     display:false,
    //     data:{key:'',value:''}
    //   }
    // });
  }

  render() {
    var margin = {top: 5, right: 50, bottom: 20, left: 50},
        w = this.state.width - (margin.left + margin.right),
        h = this.state.height - (margin.top + margin.bottom);

    var x = d3.scale.linear()
        .domain([0,10])
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

            return x(d.index);
        })
        .y(function (d) {
            return y(d.score);
        }).interpolate('cardinal');

    var transform='translate(' + margin.left + ',' + margin.top + ')';

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(5);
     
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickValues(this.state.chartData.map(function(d,i){
        if(i>0)
          return d.index;
      }).splice(1))
      .ticks(4);
     
    var yGrid = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(5)
      .tickSize(-w, 0, 0)
      .tickFormat("");

    return (
          <div>
            <svg id={this.props.chartId} width={this.state.width} height={this.state.height}>
              <g transform={transform}>
                <Grid h={h} grid={yGrid} gridType="y"/>
                <Axis h={h} axis={yAxis} axisType="y" />
                <Axis h={h} axis={xAxis} axisType="x"/>
                <path className="session-line session-shadow" d={line(this.state.chartData)} strokeLinecap="round"/>
                <Dots data={this.state.chartData} x={x} y={y} showToolTip={this.showToolTip.bind(this)} hideToolTip={this.hideToolTip.bind(this)}/>
                <ToolTip tooltip={this.state.tooltip}/> 
              </g>
            </svg>
          </div>
        );
  }
};

var Dots = (props) => {
  var _self=this;
 
        //remove last & first point
  var data = props.data.splice(1);
  data.pop();

 var circles = data.map(function(d,i){
 
    return (<circle className="dot" r="7" cx={props.x(d.index)} cy={props.y(d.score)} fill="#7dc7f4"
                    stroke="#3f5175" strokeWidth="5px" key={i}
                    onMouseOver={props.showToolTip} onMouseOut={props.hideToolTip}
                    data-key={d.index} data-value={d.score}/>)
    });
  
  return(
      <g>
        {circles}
      </g>
  );
};


class Axis extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidUpdate() { 
    this.renderAxis(); 
  }

  componentDidMount() { 
    this.renderAxis(); 
  }

  renderAxis() {
    var node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.props.axis);
  }

  render() {
   
    var translate = "translate(0,"+(this.props.h)+")";

    return (
        <g className="axis" transform={this.props.axisType=='x'?translate:""} >
        </g>
    );
  }   
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidUpdate() { 
    this.renderGrid(); 
  }

  componentDidMount() { 
    this.renderGrid(); 
  }

  renderGrid() {
    var node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.props.grid);
  }

  render() {
   
    var translate = "translate(0,"+(this.props.h)+")";

    return (
        <g className="y-grid" transform={this.props.gridType=='x'?translate:""} >
        </g>
    );
  }   
}

var ToolTip = (props) => {

        var visibility="hidden";
        var transform="";
        var x=0;
        var y=0;
        var width=150,height=70;
        var transformText='translate('+width/2+','+(height/2-5)+')';
        var transformArrow="";

        if (props.tooltip.display==true) {
            var position = props.tooltip.pos;

            x= position.x;
            y= position.y;
            visibility="visible";

            //console.log(x,y);

            if (y>height) {
                transform='translate(' + (x-width/2) + ',' + (y-height-20) + ')';
                transformArrow='translate('+(width/2-20)+','+(height-2)+')';
            } else if (y<height) {
                transform='translate(' + (x-width/2) + ',' + (Math.round(y)+20) + ')';
                transformArrow='translate('+(width/2-20)+','+0+') rotate(180,20,0)';
            }

        } else {
            visibility="hidden"
        }

        return (
            <g transform={transform}>
                <rect class="shadow" is width={width} height={height} rx="5" ry="5" visibility={visibility} fill="#6391da" opacity=".9"/>
                <polygon class="shadow" is points="10,0  30,0  20,10" transform={transformArrow}
                         fill="#6391da" opacity=".9" visibility={visibility}/>
                <text is visibility={visibility} transform={transformText}>
                    <tspan is x="0" text-anchor="middle" font-size="15px" fill="#ffffff">{props.tooltip.data.key}</tspan>
                    <tspan is x="0" text-anchor="middle" dy="25" font-size="20px" fill="#a9f3ff">{props.tooltip.data.value+" visits"}</tspan>
                </text>
            </g>
        );
};



