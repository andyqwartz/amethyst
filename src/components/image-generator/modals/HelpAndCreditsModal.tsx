import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  Link,
  Heading,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

interface HelpAndCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpAndCreditsModal: React.FC<HelpAndCreditsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Help & Credits</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            <section>
              <Heading as="h3" size="md" mb={3}>
                How to Use
              </Heading>
              <UnorderedList spacing={2}>
                <ListItem>
                  Enter a detailed description of the image you want to generate
                </ListItem>
                <ListItem>
                  Adjust the settings to fine-tune your generation parameters
                </ListItem>
                <ListItem>
                  Click "Generate" to create your image
                </ListItem>
                <ListItem>
                  Use the "Advanced Settings" for more control over the generation process
                </ListItem>
              </UnorderedList>
            </section>

            <section>
              <Heading as="h3" size="md" mb={3}>
                Tips
              </Heading>
              <UnorderedList spacing={2}>
                <ListItem>
                  Be specific in your prompts for better results
                </ListItem>
                <ListItem>
                  Use the reference image feature to guide the style
                </ListItem>
                <ListItem>
                  Experiment with different settings to find what works best
                </ListItem>
              </UnorderedList>
            </section>

            <section>
              <Heading as="h3" size="md" mb={3}>
                Credits
              </Heading>
              <VStack align="stretch" spacing={2}>
                <Text>
                  Built with ❤️ using modern web technologies:
                </Text>
                <UnorderedList spacing={2}>
                  <ListItem>
                    <Link href="https://reactjs.org" isExternal color="blue.500">
                      React
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="https://chakra-ui.com" isExternal color="blue.500">
                      Chakra UI
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="https://www.typescriptlang.org" isExternal color="blue.500">
                      TypeScript
                    </Link>
                  </ListItem>
                </UnorderedList>
              </VStack>
            </section>

            <Text fontSize="sm" color="gray.500" mt={4}>
              Version 1.0.0
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HelpAndCreditsModal;