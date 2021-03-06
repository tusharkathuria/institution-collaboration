import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchRecord, getUploadUrl, uploadFile } from '../api/records-api'
import { RecordItem } from '../types/Record'
import { UpdateRecordRequest } from '../types/UpdateRecordRequest'

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
  purpose: string,
  exit_time: string
  isLoading: Boolean,
  file: any
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
    exit_time: this.props.location.state.exit_time || "",
    isLoading: false,
    file: undefined
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

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.visitorName) {
        alert('Visitor name should not be empty')
        return
      }

      this.setLoadingState(true)

      const updateParams: UpdateRecordRequest = {
        visitor_name: this.state.visitorName,
        vehicle_number: this.state.vehicleNumber,
        phone_number: this.state.phoneNumber,
        purpose: this.state.purpose,
        exit_time: this.state.exit_time
      }

      if(this.state.file) {
        const uploadUrl = await getUploadUrl(this.props.auth.idToken, this.props.match.params.recordId)
        await uploadFile(uploadUrl, this.state.file)
      }
      if(this.state.file || this.props.location.state.attachmentUrl) {
        updateParams.attachmentId = this.props.match.params.recordId
      }
      await patchRecord(this.props.auth.idToken, this.props.match.params.recordId, updateParams)

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
          <Form.Field>
            <label>Attach image</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Attach ID proof"
              onChange={this.handleFileChange}
            />
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
          color="teal"
          loading={this.state.isLoading == true}
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
