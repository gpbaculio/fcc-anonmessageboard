import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Col, Row } from 'reactstrap';
import SearchInput from './SearchInput';
import AddBoard from './AddBoard';
import Boards from './Boards';

interface HomeRouterProps {
  title: string; // This one is coming from the router
}

interface HomeProps extends RouteComponentProps<HomeRouterProps> {
  // Add your regular properties here
}

interface HomeDispatchProps {
  // Add your dispatcher properties here
}

class Home extends Component<HomeProps & HomeDispatchProps> {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <SearchInput />
          </Col>
          <Col>
            <AddBoard />
          </Col>
        </Row>
        <Row>
          <Col>
            <Boards />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Home);
