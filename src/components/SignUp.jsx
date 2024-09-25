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
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState } from 'react';

export default function AuthenticationTitle() {
  const [value, setValue] = useState(null); // For date picker

  return (
    <Container
      size={420}
      my={40}
    >
      <Title
        ta="center"
        className={classes.title}
      >
        Join us now !
      </Title>
      <Text
        c="dimmed"
        size="sm"
        ta="center"
        mt={5}
      >
        You already have an account?{' '}
        <Anchor
          size="sm"
          component="button"
        >
          <Link to="/">Log in</Link>
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

        <TextInput
          label="Pseudo"
          placeholder="User1234"
          required
        />

        <DatePickerInput
          label="Pick date"
          placeholder="Pick date"
          value={value}
          onChange={setValue}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Your password"
          required
          mt="md"
        />

        <Button
          fullWidth
          mt="xl"
        >
          Sign up
        </Button>
      </Paper>
    </Container>
  );
}
