import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addTodo } from '../actions';

const mapDispatchToProps = (dispatch) => ({
  addTodo: (value) => dispatch(addTodo(value)),
});

@connect(null, mapDispatchToProps)
class AddTodo extends Component {
  static propTypes = {
    addTodo: PropTypes.func.isRequired,
  }
  state = {
    value: ''
  };
  handleInput = (ev) => {
    this.setState({
      value: ev.target.value,
    });
  }
  handleSubmit = (ev) => {
    ev.preventDefault();
    const { value } = this.state;
    if (!value.trim()) {
      return;
    }
    this.props.addTodo(value);
    this.setState({
      value: '',
    });
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input value={this.state.value} onChange={this.handleInput} />
        <button type="submit">Add Todo</button>
      </form>
    )
  }
}

export default AddTodo
