import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import OfferForm from '../forms/OfferForm'
import {browserHistory} from 'react-router'
import { createOffer, CREATE_OFFERS_SUCCESS } from '../actions/offers'
import autobind from 'autobind-decorator'

class AddOfferPage extends Component {
  constructor(props) {
    super(props);
  }

  @autobind
  handleSubmit(offer) {
    offer.ValidityPeriod = offer.ValidityPeriod.toISOString();
    this.props.createOffer(offer)
      .then(result => {
        if (result.type == CREATE_OFFERS_SUCCESS) {
          browserHistory.push('/offers'); // todo: improve this
        }
      }).catch(e => {
      console.log("Catch", e);
    });
  }

  render() {
    return (
      <div style={{width: '40rem', margin: '0 auto'}}>
        <OfferForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

AddOfferPage.propTypes = {
  offer: PropTypes.object
};

export default connect(null, {
  createOffer
})(AddOfferPage)
