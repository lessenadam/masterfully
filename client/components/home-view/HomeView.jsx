import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

export default class HomeView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this._getCurrentUser(function(currentUser) {
      $(this.refs.firstName).text(currentUser.firstName);
    }.bind(this));
  }

  _getCurrentUser(callback) {
    $.ajax({
      method: 'GET',
      url: '/api/users',
      success: function(data) {
        // console.log(data);
        callback(data); 
      },
      error: function(err) {
        console.error('_getCurrentUser error', err);
      },
      dataType: 'json'
    });
  }

  render() {
    return (
      <div className="view home-view">
        <div className="home-view-message">Hello, <span ref="firstName"></span>.</div>
        <h4 className="home-view-welcome">Welcome to masterfully.</h4>
        <div className="quote">
          <blockquote>
            The man who moves a mountain begins by carrying away small stones.
            <p></p>
          </blockquote>
        <hr/>
        </div>
        <div className="home-view-instruction">To begin a new video session, click on <span className="instruction-highlight"><Link to="/setup">Record</Link></span>.</div>
        <div className="home-view-instruction">To view records of all your past practices, click on <span className="instruction-highlight"><Link to="/practices">Practices</Link></span>.</div>
        <div className="home-view-instruction"></div>
      </div>
    )
  }
}