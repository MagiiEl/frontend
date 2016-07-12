import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {browserHistory} from 'react-router'

import autobind from 'autobind-decorator'

import OfferForm from '../forms/OfferForm'
import { getLocation, loadRegions } from '../actions'
import { createOffer, CREATE_OFFERS_SUCCESS } from '../actions/offers'
import { LocationPropType } from '../helpers/Location'

class AddOfferPage extends Component {
  static propTypes = {
    offer: PropTypes.object,
    location: LocationPropType
  };

  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    this.props.getLocation();
    this.props.loadRegions();
  }

  @autobind
  handleSubmit(offer) {
    offer.ValidityPeriod = offer.ValidityPeriod.toISOString();
    this.props.createOffer(offer)
      .then(result => {
        if (result.type == CREATE_OFFERS_SUCCESS) {
          browserHistory.push('/me/offers'); // todo: improve this
        }
      }).catch(e => {
      console.log("Catch", e);
    });
  }

  render() {
    return (
      <div style={{width: '40rem', margin: '0 auto'}}>
        <OfferForm onSubmit={this.handleSubmit}
                   defaultLocation={this.props.location}
                   regions={this.props.regions} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    location: state.location,
    regions: Object.values(state.entities.regions)
  }
};

export default connect(mapStateToProps, {
  createOffer,
  getLocation,
  loadRegions
})(AddOfferPage)
