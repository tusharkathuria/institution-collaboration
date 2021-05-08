import { History } from 'history'
import * as React from 'react'
import DatePicker from "react-date-picker"
import {
  Button,
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
  date: Date
  records: RecordItem[]
  visitorName: string
  vehicleNumber: string
  phoneNumber: string
  purpose: string
  loadingRecords: boolean,
  exitingVisitor: string,
  deletingRecord: string,
  creatingRecord: boolean
}

export class Records extends React.PureComponent<RecordProps, RecordsState> {
  state: RecordsState = {
    date: new Date(),
    records: [],
    visitorName: '',
    vehicleNumber: '',
    phoneNumber: '',
    purpose: '',
    loadingRecords: true,
    exitingVisitor: "",
    deletingRecord: "",
    creatingRecord: false
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

  onDateChange = (value: any) => {
    this.setState({
      date: value
    })
    this.fetchRecordsForDate(value.toDateString())
  }

  onRecordCreate = async () => {
    try {
      if(this.state.date.toDateString() !== new Date().toDateString()) {
        alert("Can't create record for past dates. Please change the date to today")
        return
      }
      if(this.state.visitorName.trim() === "") {
        alert("Can't create record with empty visitor name")
        return
      }
      this.setState({creatingRecord: true})
      const newRecord = await createRecord(this.props.auth.idToken, {
        visitor_name: this.state.visitorName,
        vehicle_number: this.state.vehicleNumber,
        phone_number: this.state.phoneNumber,
        purpose: this.state.purpose
      })
      this.setState({
        creatingRecord: false,
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

  onRecordExit = async (record: RecordItem) => {
    const exitTime = new Date().toISOString()

    this.setState({exitingVisitor: record.recordId})
    await patchRecord(
      this.props.auth.idToken, record.recordId, {
        visitor_name: record.visitor_name,
        vehicle_number: record.vehicle_number,
        phone_number: record.phone_number,
        purpose: record.purpose,
        exit_time: exitTime
    })

    record.exit_time = exitTime
    this.setState({
      exitingVisitor: "",
      records: this.state.records
    })
  }

  onRecordDelete = async (recordId: string) => {
    try {
      this.setState({deletingRecord: recordId})
      await deleteRecord(this.props.auth.idToken, recordId)
      this.setState({
        records: this.state.records.filter(record => record.recordId != recordId),
        deletingRecord: ""
      })
    } catch {
      alert('Record deletion failed')
    }
  }

  componentDidMount() {
    this.fetchRecordsForDate(this.state.date.toDateString())
  }

  async fetchRecordsForDate(date: string) {
    try {
      this.setState({loadingRecords: true})
      const records = await getRecords(this.props.auth.idToken, date)
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
        <Header as="h1">Gate entry exit records</Header>

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
            loading={this.state.creatingRecord}
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
        <Grid.Column width={16} textAlign="center">
          <DatePicker 
            format="dd-MMM-yyyy"
            clearIcon={null}
            value={this.state.date}
            onChange={this.onDateChange}
            maxDate={new Date()}/>
        </Grid.Column>
        {this.state.records.map((record, pos) => {
          return (
            <Grid.Row key={record.recordId}>
              <Grid.Column width={5} verticalAlign="middle">
                  Visitor name: {record.visitor_name}<br/>
                  Vehicle number: {record.vehicle_number}<br/>
                  Phone number: {record.phone_number}<br/>
                  Purpose: {record.purpose}<br/>
                  Entry time: {record.createdAt}<br/>
                  Exit time: {record.exit_time}<br/>
                  Created By: {record.createdBy === this.props.auth.userId ? "Me" : record.createdBy}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {record.attachmentUrl && (
                  <Image src={record.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                <Button
                  color="teal"
                  content="Exit visitor"
                  loading={this.state.exitingVisitor === record.recordId}
                  disabled={record.exit_time.trim() !== ""}
                  onClick={() => this.onRecordExit(record)}/>
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(record.recordId, record)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="red"
                  loading={this.state.deletingRecord === record.recordId}
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
