import React from 'react';
import SessionEntry from './SessionEntry.jsx';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import { calculatePerformance } from './../../lib/helpers';
import Chart from './line.jsx';

export default class SessionsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionEntries: [],
      practiceId: this.props.params.practiceId,
      performanceData: null
    }
  }

  componentDidMount() {
    console.log("wait for me to render!");
    
    this._getSessions(function(data) {
      this.setState({ sessionEntries: data });
    }.bind(this));
    // try parallel server requests here
    console.log("about to render!")

  } 

  _getSessions(callback) {
    const endpoint = '/api/session/' + this.state.practiceId;

    $.ajax({
      method: 'GET',
      url: endpoint,
      success: function(data) {
        callback(data);
        this._getAllSnapshotInfo(function(data) {
          console.log('upstream1', calculatePerformance(data));
          this.setState({
            performanceData:calculatePerformance(data)
          });
          console.log('upstream2', this.state.performanceData);
        }.bind(this));
        
      }.bind(this),
      error: function(error) {
        console.error('_getSessions Error:', error);
      },
      dataType: 'json'
    });
  }

  _getAllSnapshotInfo(callback) {
    // get all data for snapshots for practiceId
    let practiceId = this.state.practiceId;
    let url = '/api/snapshot';
    $.ajax({
      type: 'GET',
      url: url,
      data: {practiceId:practiceId},
      success: function(dataObj) {
        console.log('dataObj: ',dataObj);
        callback(dataObj);

      }.bind(this),
      error: function(error) {
        console.error('error retrieving from /api/snapshot route', error);
      }
    });
  }

  

  render() {
    if (!this.state.performanceData) {
      return <div>Loading...</div>;
    }
    return (
      <div className="view sessions-view">
        <Chart data={this.state.performanceData}/>
        <h4 className="sessions-view-title">My Sessions</h4>
        <div className="pure-g">
          {this.state.sessionEntries.map(
            entry => (
              <div className="pure-u-1-3">
                <SessionEntry entry={entry} sessionId={entry.id} />
              </div>
            )
          )}
        </div>
      </div>
    )
  }
}