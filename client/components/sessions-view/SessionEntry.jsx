import React from 'react';
import { browserHistory } from 'react-router';
import { ordinal_suffix_of } from './../../lib/helpers';

export default class SessionEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  showSessionReport() {
    browserHistory.push('/reports/' + this.props.sessionId.toString());
  }

  render() {
    return (
      <div className="session-entry-block" onClick={this.showSessionReport.bind(this)}>
        <div className="session-entry-title">{ordinal_suffix_of(this.props.index + 1) + ' Session'}</div>
        <i className="fa fa-user fa-4" aria-hidden="true"></i>
        <div className="session-entry-date">
          <span className="label">Date: </span>
          <span className="value">{this.props.entry.date}</span>
        </div>
        <div className="session-entry-duration">
          <span className="label">Duration: </span>
          <span className="value">{this.props.entry.duration} seconds</span>
        </div>
      </div>
    )
  }
};