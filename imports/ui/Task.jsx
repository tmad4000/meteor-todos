import React, { Component, PropTypes } from 'react';
import { Tasks } from '../api/tasks.js';


const STATUSES = ['new', 'acknowledged', 'in-progress', 'done'];
const nextStatus = (x) => STATUSES[(STATUSES.indexOf(x) + 1) % STATUSES.length];


// represents a single TODO item
export default class Task extends Component {
  constructor(props) {
    super(props);
  }

  advanceStatus() {
    Tasks.update(this.props.task._id, {
      $set: { status: nextStatus(this.props.status) },
    });
  }

  deleteThisTask() {
    Tasks.remove(this.props.task._id);
  }

  render() {
    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <span
          className={"status " + this.props.status}
          onClick={this.advanceStatus.bind(this)}
        ></span>

        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
        <span className="text">{this.props.task.text}</span>
    </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};
