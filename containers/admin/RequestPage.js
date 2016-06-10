import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadRequest } from '../../actions'
import Request from '../../components/Request'

function loadData(props) {
  const { loadRequest, ID } = props;
  loadRequest(ID);
}

class RequestPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    loadData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ID !== this.props.ID) {
      loadData(nextProps)
    }
  }

  render() {
    const { request, ID } = this.props;
    if (!request) {
      return <h1><i>Loading request #{ID}...</i></h1>
    }

    return (
      <div style={{width: '40rem', margin: '0 auto'}}>
        <Request request={request} />
      </div>
    )
  }
}

RequestPage.propTypes = {
  ID: PropTypes.number.isRequired,
  request: PropTypes.object,
  loadRequest: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  const ID = parseInt(ownProps.params.ID);

  const requests = state.entities.requests;
  console.dir(requests);

  return {
    ID,
    request: requests[ID]
  }
}

export default connect(mapStateToProps, {
  loadRequest
})(RequestPage)