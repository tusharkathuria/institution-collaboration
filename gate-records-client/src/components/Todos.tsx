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
  newRecordName: string
  loadingRecords: boolean
}

export class Records extends React.PureComponent<RecordProps, RecordsState> {
  state: RecordsState = {
    records: [],
    newRecordName: '',
    loadingRecords: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecordName: event.target.value })
  }

  onEditButtonClick = (recordId: string) => {
    this.props.history.push(`/records/${recordId}/edit`)
  }

  onRecordCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      if(this.state.newRecordName.trim() === "") {
        alert("Can't create record with empty name")
        return
      }
      const newRecord = await createRecord({
        visitor_name: this.state.newRecordName
      })
      this.setState({
        records: [...this.state.records, newRecord],
        newRecordName: ''
      })
    } catch {
      alert('Record creation failed')
    }
  }

  onRecordDelete = async (recordId: string) => {
    try {
      await deleteRecord(recordId)
      this.setState({
        records: this.state.records.filter(record => record.recordId != recordId)
      })
    } catch {
      alert('Record deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const records = await getRecords()
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
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New record',
              onClick: this.onRecordCreate
            }}
            fluid
            actionPosition="left"
            placeholder="New record"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
        {this.state.records.map((record, pos) => {
          return (
            <Grid.Row key={record.recordId}>
              <Grid.Column width={10} verticalAlign="middle">
                {record.visitor_name}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(record.recordId)}
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
