import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createRecord, deleteRecord, getRecords, patchRecord } from '../api/records-api'
import Auth from '../auth/Auth'
import { RecordItem } from '../types/Record'

interface RecordProps {
  auth: Auth
  history: History
}

interface RecordsState {
  records: RecordItem[]
  visitorName: string
  vehicleNumber: string
  phoneNumber: string
  purpose: string
  loadingRecords: boolean
}

export class Records extends React.PureComponent<RecordProps, RecordsState> {
  state: RecordsState = {
    records: [],
    visitorName: '',
    vehicleNumber: '',
    phoneNumber: '',
    purpose: '',
    loadingRecords: true
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

  onEditButtonClick = (recordId: string, record: RecordItem) => {
    this.props.history.push(`/records/${recordId}/edit`, record)
  }

  onRecordCreate = async () => {
    try {
      if(this.state.visitorName.trim() === "") {
        alert("Can't create record with empty visitor name")
        return
      }
      const newRecord = await createRecord(this.props.auth.idToken, {
        visitor_name: this.state.visitorName,
        vehicle_number: this.state.vehicleNumber,
        phone_number: this.state.phoneNumber,
        purpose: this.state.purpose
      })
      this.setState({
        records: [...this.state.records, newRecord],
        visitorName: '',
        phoneNumber: '',
        vehicleNumber: '',
        purpose: ''
      })
    } catch {
      alert('Record creation failed')
    }
  }

  onRecordDelete = async (recordId: string) => {
    try {
      await deleteRecord(this.props.auth.idToken, recordId)
      this.setState({
        records: this.state.records.filter(record => record.recordId != recordId)
      })
    } catch {
      alert('Record deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const records = await getRecords(this.props.auth.idToken)
      this.setState({
        records,
        loadingRecords: false
      })
    } catch (e) {
      alert(`Failed to fetch records: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Records</Header>

        {this.renderCreateRecordInput()}

        {this.renderRecords()}
      </div>
    )
  }

  renderCreateRecordInput() {
    return (
      <Grid columns="equal">
        <Grid.Column>
          <Input
            value={this.state.visitorName}
            placeholder="Visitor name"
            onChange={this.handleVisitorNameChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Input
            value={this.state.vehicleNumber}
            placeholder="Vehicle number"
            onChange={this.handleVehicleNumberChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Input
            value={this.state.phoneNumber}
            placeholder="Phone number"
            onChange={this.handlePhoneChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Input
            value={this.state.purpose}
            placeholder="Purpose"
            onChange={this.handlePurposeChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Button
            color="teal"
            labelPosition="left"
            icon="add"
            content="New Record"
            onClick={this.onRecordCreate}
          />
        </Grid.Column>
      </Grid>
    )
  }

  renderRecords() {
    if (this.state.loadingRecords) {
      return this.renderLoading()
    }

    return this.renderRecordsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderRecordsList() {
    return (
      <Grid padded>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
        {this.state.records.map((record, pos) => {
          return (
            <Grid.Row key={record.recordId}>
              <Grid.Column width={14} verticalAlign="middle">
                  Visitor name: {record.visitor_name}<br/>
                  Vehicle number: {record.vehicle_number}<br/>
                  Phone number: {record.phone_number}<br/>
                  Purpose: {record.purpose}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(record.recordId, record)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onRecordDelete(record.recordId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
