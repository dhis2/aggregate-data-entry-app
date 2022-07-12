// src/mocks/server.js
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
    // we can add handlers here or add them to the specific tests
    rest.post('/login', null),
]

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)
