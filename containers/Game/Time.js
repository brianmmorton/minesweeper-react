import React, { Component } from 'react';
import momentDurationFormatSetup from 'moment-duration-format';
import moment from 'moment';
momentDurationFormatSetup(moment);

export default class Time extends Component {

  constructor (props) {
    super(props);

    this.state = {
      time: props.timer.time,
      timer_id: props.timer.id,
    }

    props.timer.on('update', time => {
      this.setState({ time });
    });
  }

  componentWillReceiveProps ({ timer }) {
    if (timer.id !== this.state.timer_id) {
      this.setState({
        time: timer.time,
      });

      timer.on('update', time => {
        this.setState({ time });
      });
    }
  }

  render () {
    return (
      <h3>
        {moment.duration(this.state.time, 'seconds').format()}
      </h3>
    );
  }
}
