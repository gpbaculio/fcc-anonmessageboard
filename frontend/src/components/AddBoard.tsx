import React, { Component } from 'react';
import { Form, Input } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router';
import { createBoard } from '../store/boards/actions';
import { connect } from 'react-redux';
// interface HomeRouterProps {
//   title: string;   // This one is coming from the router
// }
// interface HomeProps extends RouteComponentProps<HomeRouterProps> {
interface AddBoardProps extends RouteComponentProps {
  // Add your regular properties here
}

interface AddBoardDispatchProps {
  // Add your dispatcher properties here
  createBoard: (name: string) => void;
}

interface AddBoardState {
  [text: string]: string;
}

class AddBoard extends Component<
  AddBoardProps & AddBoardDispatchProps,
  AddBoardState
> {
  constructor(props: AddBoardProps & AddBoardDispatchProps) {
    super(props);
    this.state = {
      text: ''
    };
  }
  onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = this.state.text.trim();
    if (text) this.props.createBoard(text);
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { text } = this.state;
    return (
      <Form onSubmit={this.onSubmit}>
        <Input name='text' value={text} onChange={this.onChange} />
      </Form>
    );
  }
}

// const mapStateToProps = (state) => ({

// })

const mapDispatchToProps = {
  createBoard
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(AddBoard));
