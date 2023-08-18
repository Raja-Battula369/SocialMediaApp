import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import { v4 } from 'uuid';
function DropzoneComponent({ image, setImage, preview, setPreview }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    // Do something with the files

    const preview = URL.createObjectURL(acceptedFiles[0]);
    const imageRef = ref(storage, `images/${acceptedFiles[0].name + v4()}`);
    uploadBytes(imageRef, acceptedFiles[0])
      .then((data) => {
        getDownloadURL(data.ref).then((url) => setImage(url));
      })
      .catch((er) => console.log(er));
    setPreview(preview);

    // console.log(acceptedFiles[0]);
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
            <img src={preview} height={74} width={204} alt="preview" />

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
