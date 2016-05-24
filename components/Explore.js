import React, { Component, PropTypes } from 'react'

import {Link} from 'react-router'

const GITHUB_REPO = 'https://github.com/reactjs/redux'

export default class Explore extends Component {
  constructor(props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleGoClick = this.handleGoClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value)
    }
  }

  getInputValue() {
    return this.refs.input.value
  }

  setInputValue(val) {
    // Generally mutating DOM is a bad idea in React components,
    // but doing this for a single uncontrolled field is less fuss
    // than making it controlled and maintaining a state for it.
    this.refs.input.value = val
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick() {
    this.props.onChange(this.getInputValue())
  }

  render() {
    return (
      <div>
        <p>Type a user ID and hit 'Go':</p>
        <input size="45"
               ref="input"
               defaultValue={this.props.value || ''}
               onKeyUp={this.handleKeyUp} />
        <button onClick={this.handleGoClick}>
          Go!
        </button>
        <p>
          Or check out <Link to="/users">/users</Link>
        </p>
        <p>
          Move the DevTools with Ctrl+W or hide them with Ctrl+H.
        </p>
      </div>
    )
  }
}

Explore.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
