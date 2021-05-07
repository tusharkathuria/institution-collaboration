import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchRecord } from '../api/records-api'
import { RecordItem } from '../types/Record'

interface EditRecordProps {
  match: {
    params: {
      recordId: string
    }
  },
  location: {
    state: RecordItem
  }
  auth: Auth
}

interface EditRecordState {
  visitorName: string
  vehicleNumber: string
  phoneNumber: string
  purpose: string
  isLoading: Boolean
}

export class EditRecord extends React.PureComponent<
  EditRecordProps,
  EditRecordState
> {
  state: EditRecordState = {
    visitorName:  this.props.location.state.visitor_name,
    vehicleNumber: this.props.location.state.vehicle_number || "",
    phoneNumber: this.props.location.state.phone_number || "",
    purpose: this.props.location.state.purpose || "",
    isLoading: false
  }

  handleVisitorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ visitorName: event.target.value })
  }

  handleVehicleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ vehicleNumber: event.target.value })
  }

  handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ phoneNumber: event.target.value })
  }

  handlePurposeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ purpose: event.target.value })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.visitorName) {
        alert('Visitor name should not be empty')
        return
      }

      this.setLoadingState(true)
      await patchRecord(
        this.props.auth.idToken, this.props.match.params.recordId, {
          visitor_name: this.state.visitorName,
          vehicle_number: this.state.vehicleNumber,
          phone_number: this.state.phoneNumber,
          purpose: this.state.purpose
        })

      this.setLoadingState(false)

      alert('Record updated')
    } catch (e) {
      alert('Could not update the record: ' + e.message)
    } finally {
      this.setLoadingState(false)
    }
  }

  setLoadingState(isLoading: Boolean) {
    this.setState({
      isLoading
    })
  }

  render() {
    return (
      <div>
        <h1>Update the gate record</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Visitor Name</label>
            <input value={this.state.visitorName} onChange={this.handleVisitorNameChange}/>
          </Form.Field>
          <Form.Field>
            <label>Vehicle Number</label>
            <input value={this.state.vehicleNumber} onChange={this.handleVehicleNumberChange}/>
          </Form.Field>
          <Form.Field>
            <label>Phone number</label>
            <input value={this.state.phoneNumber} onChange={this.handlePhoneChange}/>
          </Form.Field>
          <Form.Field>
            <label>Purpose</label>
            <input value={this.state.purpose} onChange={this.handlePurposeChange}/>
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.isLoading === true && <p>Updating record</p>}
        <Button
          loading={this.state.isLoading == true}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
