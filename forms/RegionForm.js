import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {browserHistory} from 'react-router';

import autobind from 'autobind-decorator';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card'

import Validation from "./helpers/Validation";

import { RegionFields } from "../schemas/RegionSchema"

import FreeDraw from '../components/maps/FreeDraw';
import SimpleMap from '../components/maps/SimpleMap';

import { LocationPropType } from "../helpers/Location";

export class RegionForm extends Component {
  static propTypes = {
    defaultLocation: LocationPropType
  };

  @autobind
  handleMarkers(event) {
    this.props.fields.Area.onChange(event.latLngs[0].map((point) => { return { Latitude: point.lat, Longitude: point.lng }}));
  }

  render() {
    const {fields: { Name, Area }, handleSubmit, submitting, invalid, resetForm, pristine} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader style={{backgroundColor: 'lightgray'}}
                      title="Create a region"/>
          <CardText>
            <div>
              <TextField {...Name}
                ref="Name"
                type="text"
                floatingLabelText="The region's name"
                errorText={Name.touched && Name.error}/>
            </div>
          </CardText>

          <SimpleMap center={this.props.defaultLocation} style={{height: 400}}>
            <FreeDraw onMarkers={this.handleMarkers} />
          </SimpleMap>
          {/* todo: Area.touched && Area.error */}

          <CardActions style={{display: 'flex', flexDirection: 'row-reverse'}}>
            {/* everything is reversed with flex-direction, because the submit button should come first (in DOM) */}
            <FlatButton ref="submit" label="Create region" disabled={invalid || submitting} style={{marginLeft: 'auto'}}
                        type="submit"/>
            <FlatButton label="Reset" disabled={pristine || submitting} onTouchTap={resetForm} />
            <FlatButton label="Cancel" disabled={submitting} onTouchTap={() => browserHistory.goBack()} />
          </CardActions>
        </Card>
      </form>
    );
  }
}

export default reduxForm({
  form: 'region-form',
  fields: Object.keys(RegionFields),
  validate: Validation(RegionFields)
})(RegionForm);