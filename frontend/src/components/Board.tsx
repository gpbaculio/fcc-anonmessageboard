import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import * as H from 'history';
import { BoardType } from '../store/boards/types';
import { Card, CardTitle, CardBody, Button } from 'reactstrap';
import { timeDifferenceForDate } from './utils';

interface BoardProps extends RouteComponentProps {
  location: H.Location;
}

class Board extends Component<BoardProps> {
  render() {
    const { board }: { board: BoardType } = this.props.location.state;
    return (
      <div className='board-container d-flex justify-content-center align-items-center'>
        <Card className='board-card'>
          <CardBody>
            <CardTitle className='mb-0'>
              <div className='d-flex mb-3 justify-content-between'>
                <div className='d-flex flex-column'>
                  <h6>{board.name}</h6>
                </div>
                <div>{timeDifferenceForDate(board.createdAt)}</div>
              </div>
              <Button className='btn-block' color='primary'>
                Add Thread
              </Button>
            </CardTitle>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default withRouter(Board);
