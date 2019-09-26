import React, { Component } from 'react';
import { Form, Input, Spinner } from 'reactstrap';

interface SearchInputState {
  search_text: string;
  showResult: boolean;
  [_state_key: string]: boolean | string;
}

class SearchInput extends Component<{}, SearchInputState> {
  delayTimer: null | number = null;
  constructor(props: {}) {
    super(props);

    this.state = {
      search_text: '',
      showResult: false
    };
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, showResult: true }, async () => {
      const { search_text } = this.state;
      if (search_text) {
        if (this.delayTimer) clearTimeout(this.delayTimer);
        this.setState({ loading: true });
        this.delayTimer = window.setTimeout(async () => {
          await this.fetchBoards(search_text);
        }, 2000);
      }
    });
  };
  fetchBoards = (search_text: string) => {};
  render() {
    const { search_text } = this.state;
    return (
      <Form className='d-flex w-50 search-form'>
        <div className='search-input d-flex flex-column position-relative'>
          <Input
            autoComplete='off'
            value={search_text}
            onChange={this.handleChange}
            className='flex-grow-1'
            required
            type='text'
            name='searchText'
            id='search-book'
            placeholder='Search Books'
          />
          <div className='autocomplete-items'>
            {/*hasSearched && !books.edges.length && <div>Book does not exist</div>*/}
            {/*showResult && books.edges.map(({ node: { id, title } }) => {
        //   const bookTitle = title.replace(new RegExp(searchText, 'g'), `<strong>${searchText}</strong>`);
        //   return (
        //     <div
        //       key={id}
        //       onClick={() => this.handleOnBlur(title, id)}
        //       dangerouslySetInnerHTML={{ __html: `<span>${bookTitle}</span>` }}
        //     />
        //   );
         // })*/}
            {false && ( // looading boolean
              <div className='mx-auto d-flex justify-content-center'>
                <Spinner color='info' className='mr-2' /> Loading...
              </div>
            )}
          </div>
        </div>
      </Form>
    );
  }
}

export default SearchInput;
