import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { patchRecord } from '../api/records-api'

interface EditRecordProps {
  match: {
    params: {
      recordId: string
    }
  }
  auth: Auth
}

interface EditRecordState {
  name: string
  isLoading: Boolean
}

export class EditRecord extends React.PureComponent<
  EditRecordProps,
  EditRecordState
> {
  state: EditRecordState = {
    name: "",
    isLoading: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: event.target.value
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.name) {
        alert('Visitor name should not be empty')
        return
      }

      this.setLoadingState(true)
      const uploadUrl = await patchRecord(
        this.props.match.params.recordId, {
          visitor_name: this.state.name
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
            <input onChange={this.handleNameChange}/>
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
