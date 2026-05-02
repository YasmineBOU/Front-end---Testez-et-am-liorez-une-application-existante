type MockUser = {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  role: string;
};

type RegisterBody = {
  firstName?: string;
  lastName?: string;
  login?: string;
  password?: string;
};

type LoginBody = {
  login?: string;
  password?: string;
};

const users = {
  admin: {
    firstName: "Cypress",
    lastName: "Agent",
    login: "cagent",
    password: "cagent1234",
    role: "ADMIN",
  },
  regular: {
    firstName: "Test",
    lastName: "Register",
    login: "tregister",
    password: "tregister",
    role: "USER",
  },
  serverError: {
    firstName: "Server",
    lastName: "Error",
    login: "server-error-user",
    password: "server-error-password",
    role: "",
  },
  newUser: {
    firstName: "Register",
    lastName: "Test",
    login: "rtest",
    password: "rtest",
    role: "USER",
  },
} satisfies Record<string, MockUser>;

const localStorage = require('./fixtures/localStorage.json');

function isSameUser(login: string | undefined, user: MockUser): boolean {
  return login === user.login;
}

function createJwtToken(roles: string[]): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 3600,
      roles: roles.map((authority) => ({ authority })),
    })
  );

  return `${header}.${payload}.mock-signature`;
}

export function setupMockBackend(): void {
  cy.intercept("POST", "/api/login", (req) => {
    const body = req.body as LoginBody;

    if (body.login === users.serverError.login) {
      req.reply({
        statusCode: 500,
        body: { message: "Unexpected server error" },
      });
      return;
    }

    if (
      (isSameUser(body.login, users.admin) && body.password === users.admin.password) ||
      (isSameUser(body.login, users.regular) && body.password === users.regular.password)
    ) {
      const isAdminUser = isSameUser(body.login, users.admin);

      req.reply({
        statusCode: 200,
        body: {
          token: createJwtToken(isAdminUser ? ["ROLE_ADMIN"] : ["ROLE_USER"]),
        },
      });
      return;
    }

    req.reply({
      statusCode: 401,
      body: {
        message: "Incorrect credentials",
      },
    });
  });

  cy.intercept("POST", "/api/register", (req) => {
    const body = req.body as RegisterBody;

    if (isSameUser(body.login, users.regular)) {
      req.reply({
        statusCode: 409,
        body: {
          error: "User already exists",
          status: 409,
          message: "Login already registered",
        },
      });
      return;
    }

    req.reply({
      statusCode: 201,
      body: {
        message: "User registered successfully",
        user: {
          id: 1,
          firstName: body.firstName ?? users.newUser.firstName,
          lastName: body.lastName ?? users.newUser.lastName,
          login: body.login ?? users.newUser.login,
        },
      },
    });
  });

  cy.intercept("GET", "/api/read-user", [
    { id: 1, firstName: "John", lastName: "Doe", role: "USER" },
    { id: 2, firstName: "Jane", lastName: "Smith", role: "ADMIN" },
  ]);

  cy.intercept("GET", "/api/read-user/*", (req) => {
    const userId = Number(req.url.split("/").pop());

    req.reply({
      statusCode: 200,
      body: {
        id: userId,
        firstName: "John",
        lastName: "Doe",
        login: "johndoe",
        role: "USER",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    });
  });

  cy.intercept("POST", "/api/add-user", {
    statusCode: 201,
    body: { message: "User created successfully" },
  });

  cy.intercept("PUT", "/api/update-user/*", {
    statusCode: 200,
    body: { message: "User updated successfully" },
  });

  cy.intercept("DELETE", "/api/delete-user/*", {
    statusCode: 200,
    body: { message: "User deleted successfully" },
  });
}
