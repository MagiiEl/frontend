import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import autobind from 'autobind-decorator';

import { loadOffer, OFFER_REQUEST } from '../../actions'
import OfferCard from '../../components/posts/OfferCard'

import Center from '../layout/Center';
import Loading from '../misc/Loading';
import loadingHelper from "../helpers/loadingHelper";

class OfferPage extends Component {
  constructor(props) {
    super(props);
  }

  loadData() {
    this.props.loadOffer(this.props.ID, ['User']);
  }
  
  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ID !== this.props.ID) {
      this.loadData();
    }
  }
  
  @autobind
  handleNavigateToEditOffer() {
    browserHistory.push(`/me/offers/${ this.props.ID }/edit`);
  }

  render() {
    const { offer, isOwnOffer, loading } = this.props;
    if (loading) {
      return <Loading resourceName="offer" />;
    }

    return (
      <Center vertical={true}>
        <OfferCard offer={offer} editable={isOwnOffer} navigateToEditOffer={this.handleNavigateToEditOffer} />
      </Center>
    )
  }
}

OfferPage.propTypes = {
  ID: PropTypes.string.isRequired,
  offer: PropTypes.object,
  loadOffer: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
  const { ID } = ownProps.params;
  const offer = state.entities.offers[ID];
  
  return {
    ID,
    isOwnOffer: offer && offer.User && offer.User.Mail == state.login.token.iss,
    offer,
    loading: loadingHelper(state, offer, OFFER_REQUEST)
  }
}

export default connect(mapStateToProps, {
  loadOffer
})(OfferPage)
