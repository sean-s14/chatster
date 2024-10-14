# Client

## TODO

- Create tests for service functions
- Add search bar to search for users
- In Setting page have different sections for:
  - General Info (username, name, etc.)
  - Email
  - Password
- Implement functionality to:
  - update user profile
  - update user password
  - accept, reject, and cancel friend requests
- Add a success variant for the shadcn button component

## Issues

# Server

## TODO

- Create utility to generate an admin/superuser before running tests
- Add more tests to routes/auth.test.ts and routes/user.test.ts
- Add property to enable private or public user accounts
- Implement email confirmation
- Implement pagination for /api/users
- Redesign tests to use clean database after each describe section to make it easier to debug

## Issues

- Inconsistent naming of error messages between routes/auth.test.ts and routes/user.test.ts
- Ocassionally receive the following error:
  "FAIL src/pages/friends-page.test.tsx > Friends Page > should render skeletons when loading
  TestingLibraryElementError: Unable to find an element by: [data-testid="friends-page-content-skeleton"]"
