// Since authentication is implemented with a global JWT guard,
// tests should always authenticate when guards are enabled.
// This can be overridden with TEST_MODE=auth for explicit auth testing,
// but by default, we assume auth is implemented if not explicitly disabled.
export default process.env.TEST_MODE !== 'no-auth';
