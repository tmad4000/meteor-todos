import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
 
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
      textInput: '',
    };
  }


  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
 

  // getTasks() {
  //   return [
  //     { _id: 1, text: 'This is task 1' },
  //     { _id: 2, text: 'This is task 2' },
  //     { _id: 3, text: 'This is task 3' },
  //   ]
  // }
 
  renderTasks() {
    let filteredTasks = this.props.tasks;

    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => task.status !== 'done');
    }
    if (this.state.textInput !== '') {
      filteredTasks = filteredTasks.filter(task => task.text.indexOf(this.state.textInput.trim()) !== -1);
    }

    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} status={task.status} />
    ));
  }
 
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.state.textInput.trim();

    Tasks.insert({
      text,
      createdAt: new Date(),
      status: 'new',
    });

    this.setState({'textInput': ''});
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>
           <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              onChange={(e) => this.setState({textInput:e.target.value})}
              value={this.state.textInput}
              placeholder="Type to add new tasks"
            />
          </form>
        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({},{ sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ status: { $ne: 'done' } }).count(),
  };
}, App);

