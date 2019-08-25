import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import { BoardType } from '../store/boards/types';

interface BoardProps extends RouteComponentProps {
  location: H.Location;
}

class Board extends Component<BoardProps> {
  render() {
    const { board }: { board: BoardType } = this.props.location.state;
    return <div>{board.name}</div>;
  }
}

export default withRouter(Board);
