describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  describe("UI Elements", () => {
    it("should display the 'Login Form' title", () => {
      cy.contains("h2", "Login Form").should("be.visible");
    });

    it("should have a functional 'Back to Home' button", () => {
      cy.get(".back-home-btn").should("be.visible").click();
      cy.url().should("include", "/");
    });

    it("should have a 'Login' label", () => {
      cy.contains("label", "Login").should("be.visible");
    });

    it("should have a 'Login' input field", () => {
      cy.get("input[id='login']").should("be.visible");
    });

    it("should have a 'Password' label", () => {
      cy.contains("label", "Password").should("be.visible");
    });

    it("should have a 'Password' input field", () => {
      cy.get("input[id='password']").should("be.visible");
    });

    it("should have a 'Login' button", () => {
      cy.contains("button", "Login").should("be.visible");
    });

    it("should have a 'Clear' button", () => {
      cy.contains("button", "Clear").should("be.visible");
    });

    it("should have a 'Not registered? Register' link", () => {
      cy.contains("button", "Not registered? Register").should("be.visible").click();
      cy.url().should("include", "/register");
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors when fields are empty", () => {
      cy.contains("button", "Login").click();
      cy.contains("Login is required").should("be.visible");
      cy.contains("Password is required").should("be.visible");
    });

    it('should clear form fields when "Clear" button is clicked', () => {
      cy.get("input[id='login']").type("testuser");
      cy.get("input[id='password']").type("password123");

      cy.contains("button", "Clear").click();
      
      cy.get("input[id='login']").should("have.value", "");
      cy.get("input[id='password']").should("have.value", "");
    });
  });

  describe("Authentication Flow", () => {
    const invalidCredentialsErrorStatuses = [400, 401, 403];

    invalidCredentialsErrorStatuses.forEach((status) => {
      it(`should show an error message for ${status}`, () => {
          cy.fixture("users").then((users) => {
          cy.get("input[id=login]").type(users.invalidUser.login);
          cy.get("input[id=password]").type(users.invalidUser.password);
        });
        // intercept the login request and mock the response with the specified error status
        (cy as any).intercept("POST", "/api/login", {
          statusCode: status,
          body: {},
        }).as("loginRequest");

        cy.contains("button", "Login").click();
        cy.wait("@loginRequest");

        cy.on("window:alert", (text) => {
          expect(text).to.contains("Incorrect credentials, please try again.");
        });
      });
    });

    it("should show a generic error message for any other status code", () => {
      cy.fixture("users").then((users) => {
          cy.get("input[id=login]").type(users.validRegularUser.login);
          cy.get("input[id=password]").type(users.validRegularUser.password);
      });

      // Intercept the login request and mock the response to return a status code that is not in the list of invalidCredentialsErrorStatuses
      (cy as any).intercept("POST", "/api/login", (req: any) => {
          req.continue((res: any) => {
            // Check if the status code is not in the list of invalid credentials error statuses
            if (!invalidCredentialsErrorStatuses.includes(res.statusCode)) {
                res.statusCode = 500;
                res.send({}); 
            }
          });
      }).as("loginRequest");

      cy.contains("button", "Login").click();
      cy.wait("@loginRequest");

      cy.on("window:alert", (text) => {
          expect(text).to.contains("An error occurred. Please try again later.");
      });
    });

    it("should navigate to the admin pannel after successful login", () => {
      cy.fixture("users").then((users) => {
        cy.get("input[id='login']").type(users.validAdminUser.login);
        cy.get("input[id='password']").type(users.validAdminUser.password);

        cy.contains("button", "Login").click();
      });

      cy.url().should("include", "/admin-pannel");
    });

    it("should store the token and logged in user for Admin User in localStorage after successful login", () => {
      cy.fixture("users").then((users) => {
        cy.get("input[id='login']").type(users.validAdminUser.login);
        cy.get("input[id='password']").type(users.validAdminUser.password);

        cy.contains("button", "Login").click();
      });

      cy.fixture("localStorage").then((localStorage) => {
        cy.window().its("localStorage").invoke("getItem", localStorage.tokenKey).should("exist");
        cy.window().its("localStorage").invoke("getItem", localStorage.loggedInUserKey).should("exist");
      });      
    });

    it("should store the token and logged in user for any lambda user in localStorage after successful login", () => {
      cy.fixture("users").then((users) => {
        cy.get("input[id='login']").type(users.validRegularUser.login);
        cy.get("input[id='password']").type(users.validRegularUser.password);

        cy.contains("button", "Login").click();
      });

      cy.fixture("localStorage").then((localStorage) => {
        cy.window().its("localStorage").invoke("getItem", localStorage.tokenKey).should("exist");
        cy.window().its("localStorage").invoke("getItem", localStorage.loggedInUserKey).should("exist");
      });      
    });

  });


});
