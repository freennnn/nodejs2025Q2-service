# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```bash
git clone <https://github.com/freennnn/nodejs2025Q2-service>
```

## Installing NPM modules

```bash
npm install
```

## Running application

```bash
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing <http://localhost:4000/doc/>.
For more information about OpenAPI/Swagger please visit <https://swagger.io/>.

## API Endpoints

The application provides REST API endpoints for managing:

- **Users** (`/user`) - Create, read, update, delete users
- **Tracks** (`/track`) - Manage music tracks with artist/album references
- **Albums** (`/album`) - Manage music albums with artist references
- **Artists** (`/artist`) - Manage music artists
- **Favorites** (`/favs`) - Add/remove tracks, albums, and artists to/from favorites

All endpoints support standard CRUD operations. See the OpenAPI documentation for detailed API specifications.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```bash
npm run test
```

To run only one of all test suites

```bash
npm run test -- <path to suite>
```

To run all test with authorization

```bash
npm run test:auth
```

To run only specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```bash
npm run lint
```

```bash
npm run format
```

### Debugging in VSCode

For more information, visit: <https://code.visualstudio.com/docs/editor/debugging>
