import React from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { MdPersonSearch } from 'react-icons/md';

const Search = () => {
  return (
    <>
      <InputGroup maxWidth="15rem" overflow={'hidden'}>
        <Input
          type={'text'}
          title="search underBuliding"
          placeholder="search"
          appearance={'none'}
          outline={false}
          isDisabled={true}
        />
        <InputRightElement
          children={
            <IconButton
              isDisabled={true}
              title="search"
              appearance={'none'}
              icon={<MdPersonSearch />}
            />
          }
        />
      </InputGroup>
    </>
  );
};

export default Search;
