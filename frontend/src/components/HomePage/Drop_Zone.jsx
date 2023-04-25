import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';

function DropzoneComponent({ image, setImage }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    setImage(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  return (
    <Box w="full" {...getRootProps()}>
      <input {...getInputProps()} />
      <HStack w="full" gap={'1rem'} justifyContent={'space-between'}>
        {!image ? (
          <>
            <Text>Drag and drop your file here or click to upload</Text>
            <MdOutlineModeEdit />
          </>
        ) : (
          <>
            <Text>{image?.name}</Text>
            <IconButton
              title="deleteImg"
              appearance={'none'}
              isRound
              size={'sm'}
              icon={<MdDeleteOutline />}
              onClick={() => setImage(null)}
            />
          </>
        )}
      </HStack>
    </Box>
  );
}

export default DropzoneComponent;
