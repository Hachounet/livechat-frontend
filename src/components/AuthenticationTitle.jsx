import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from '@mantine/core';
import classes from './AuthenticationTitle.module.css';
import { Link } from 'react-router-dom';

export default function AuthenticationTitle() {
  return (
    <Container
      size={420}
      my={40}
    >
      <Title
        ta="center"
        className={classes.title}
      >
        Welcome back!
      </Title>
      <Text
        c="dimmed"
        size="sm"
        ta="center"
        mt={5}
      >
        Do not have an account yet?{' '}
        <Anchor
          size="sm"
          component="button"
        >
          <Link to="/signup">Create account</Link>
        </Anchor>
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
      >
        <TextInput
          label="Email"
          placeholder="you@youremail.com"
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />

        <Button
          fullWidth
          mt="xl"
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
