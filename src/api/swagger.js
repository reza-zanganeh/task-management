const projectConfig = require("../config/index")
const PORT = projectConfig.server.httpServer.port

module.exports.options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      description: "A simple project for Bad Saba company interview",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        // User schema already defined
        User: {
          type: "object",
          required: ["fullname", "phonenumber", "password"],
          properties: {
            fullname: {
              type: "string",
              description: "Full name of the user",
            },
            phonenumber: {
              type: "string",
              description: "Phone number of the user",
            },
            password: {
              type: "string",
              description: "Password of the user",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Unique identifier of the task",
              example: 1,
            },
            userId: {
              type: "integer",
              description: "ID of the user who created the task",
              example: 123,
            },
            title: {
              type: "string",
              description: "Title of the task",
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              description: "Detailed description of the task",
              example: "Write the complete API documentation for the project.",
            },
            status: {
              type: "string",
              enum: ["Pending", "InProgress", "Completed"],
              description: "Status of the task",
              example: "Pending",
            },
            deadline: {
              type: "string",
              format: "date-time",
              description: "Deadline for the task completion",
              example: "2024-12-31T23:59:59.999Z",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the task was created",
              example: "2024-12-01T12:34:56.789Z",
            },
          },
        },
      },
      responses: {
        400: {
          description: "The request is invalid. Please check your input data.",
          content: {
            "application/json": {},
          },
        },
        401: {
          description: "This operation requires registration / login.",
          content: {
            "application/json": {},
          },
        },
        403: {
          description:
            "You do not have the necessary permissions for this operation.",
          content: {
            "application/json": {},
          },
        },
        404: {
          description: "The requested path was not found.",
          content: {
            "application/json": {},
          },
        },
        500: {
          description:
            "The server encountered an internal issue. Please be patient as we work on resolving it.",
          content: {
            "application/json": {},
          },
        },
      },
    },
    paths: {
      "/api/user/login_or_register": {
        post: {
          summary: "Login or register a user",
          tags: ["User"],
          description:
            "This method checks whether the user has already registered. If the user exists, a login request is made, otherwise, an OTP code is sent for registration.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["phonenumber"],
                  properties: {
                    phonenumber: {
                      type: "string",
                      description: "Phone number of the user",
                      example: "09123456789",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Operation was successful.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      otpToken: {
                        type: "string",
                        description: "OTP code token (JWT)",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                      },
                      expiresTimeInMinutes: {
                        type: "integer",
                        description:
                          "The validity time of the OTP code in minutes",
                        example: 5,
                      },
                      fullname: {
                        type: "string",
                        description:
                          "Full name of the user (if the user is already registered)",
                        example: "Ali Zanganeh",
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
      "/api/user/login": {
        post: {
          summary: "Login a registered user",
          tags: ["User"],
          description:
            "This endpoint handles the login process for registered users using the provided OTP token and password.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["password"],
                  properties: {
                    password: {
                      type: "string",
                      description: "Password of the user",
                      example: "userpassword123",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              in: "header",
              name: "otptoken",
              required: true,
              description: "The OTP token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          ],
          responses: {
            200: {
              description: "Login successful and token returned.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accesstoken: {
                        type: "string",
                        description:
                          "Access token (JWT) for the logged-in user",
                      },
                      expiresTime: {
                        type: "integer",
                        description:
                          "Time in milliseconds when the access token expires",
                      },
                      fullname: {
                        type: "string",
                        description: "Full name of the logged-in user",
                        example: "Ali Zanganeh",
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            401: {
              $ref: "#/components/responses/401",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
      "/api/user/register": {
        post: {
          summary: "Register a new user",
          tags: ["User"],
          description:
            "This method registers a new user after verifying the OTP code.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["fullname", "password", "otpCode"],
                  properties: {
                    fullname: {
                      type: "string",
                      description: "Full name of the user",
                    },
                    password: {
                      type: "string",
                      description: "Password of the user",
                    },
                    otpCode: {
                      type: "string",
                      description: "OTP code sent for verification",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              in: "header",
              name: "otptoken",
              required: true,
              description: "The OTP token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          ],
          responses: {
            201: {
              description: "User successfully registered.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accesstoken: {
                        type: "string",
                        description: "JWT token for authentication",
                      },
                      fullname: {
                        type: "string",
                        description: "Full name of the registered user",
                      },
                      expiresTime: {
                        type: "integer",
                        description: "Token expiration time in milliseconds",
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
      "/api/user/forget-password": {
        post: {
          summary: "Forget Password",
          tags: ["User"],
          description:
            "Request a password reset and receive a temporary password via SMS.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["phonenumber"],
                  properties: {
                    phonenumber: {
                      type: "string",
                      description: "Phone number of the user",
                      example: "09123456789",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              in: "header",
              name: "otptoken",
              required: true,
              description: "The OTP token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          ],
          responses: {
            200: {
              description: "Temporary password sent successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description:
                          "Message indicating the new password was sent successfully.",
                        example:
                          "رمز عبور جدید برای شما ارسال شد لطفا بعد از ورود برای تغییر رمز عبور از قسمت تنظیمات حساب کاربری اقدام کنید",
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
      "/api/user/change-password": {
        patch: {
          summary: "Change Password",
          tags: ["User"],
          description:
            "Change the user's password. The user must be authenticated.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["newPassword"],
                  properties: {
                    newPassword: {
                      type: "string",
                      description: "The new password for the user",
                      example: "newsecurepassword123",
                    },
                  },
                },
              },
            },
          },
          parameters: [
            {
              in: "header",
              name: "accesstoken",
              required: true,
              description: "JWT access token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          ],
          responses: {
            200: {
              description: "Password changed successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      operationName: {
                        type: "string",
                        description:
                          "Message indicating the password was changed successfully.",
                        example: "رمز عبور شما با موفقیت تغییر کرد",
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
      "/api/task": {
        post: {
          summary: "Create a new Task",
          tags: ["Task"],
          description: "Create a new task for the authenticated user.",
          parameters: [
            {
              in: "header",
              name: "accesstoken",
              required: true,
              description: "JWT access token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "deadline", "status"],
                  properties: {
                    title: {
                      type: "string",
                      description: "Title of the task",
                      example: "Complete project documentation",
                    },
                    description: {
                      type: "string",
                      description: "Detailed description of the task",
                      example:
                        "Write the complete API documentation for the project.",
                    },
                    deadline: {
                      type: "string",
                      format: "date-time",
                      description: "Deadline for the task completion",
                      example: "2024-12-31T23:59:59.999Z",
                    },
                    status: {
                      type: "string",
                      enum: ["Pending", "InProgress", "Completed"],
                      description: "Status of the task",
                      example: "Pending",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Task created successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task", // استفاده از اسکیما Task
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            401: {
              $ref: "#/components/responses/401",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
        get: {
          summary: "Retrieve a list of tasks",
          tags: ["Task"],
          description:
            "Retrieve tasks created by the authenticated user. Optional query parameters can filter or sort the results.",
          parameters: [
            {
              in: "header",
              name: "accesstoken",
              required: true,
              description: "JWT access token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
            {
              in: "query",
              name: "status",
              required: false,
              description: "Filter tasks by status",
              schema: {
                type: "string",
                enum: ["Pending", "InProgress", "Completed"], // گزینه‌های قابل قبول
                example: "Pending",
              },
            },
            {
              in: "query",
              name: "deadline[gte]",
              required: false,
              description: "Filter tasks with deadlines after a specific date",
              schema: {
                type: "string",
                format: "date-time",
                example: "2024-01-01T00:00:00Z",
              },
            },
            {
              in: "query",
              name: "deadline[lte]",
              required: false,
              description: "Filter tasks with deadlines before a specific date",
              schema: {
                type: "string",
                format: "date-time",
                example: "2024-12-31T23:59:59Z",
              },
            },
            {
              in: "query",
              name: "sortKey",
              required: false,
              description: "Sort the tasks by a specific key",
              schema: {
                type: "string",
                enum: ["created_at", "deadline", "status"],
                example: "created_at",
              },
            },
            {
              in: "query",
              name: "order",
              required: false,
              description: "Order the sorting by ascending or descending",
              schema: {
                type: "string",
                enum: ["asc", "desc"],
                example: "asc",
              },
            },
            {
              in: "query",
              name: "page",
              required: false,
              description: "Page number for pagination",
              schema: {
                type: "integer",
                default: 1,
                example: 1,
              },
            },
            {
              in: "query",
              name: "limit",
              required: false,
              description: "Number of tasks per page for pagination",
              schema: {
                type: "integer",
                default: 10,
                example: 10,
              },
            },
          ],
          responses: {
            200: {
              description: "Tasks retrieved successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Task",
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            401: {
              $ref: "#/components/responses/401",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
      "/api/task/{id}": {
        delete: {
          summary: "Delete a Task",
          tags: ["Task"],
          description: "Delete a task by its ID.",
          parameters: [
            {
              in: "header",
              name: "accesstoken",
              required: true,
              description: "JWT access token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
            {
              in: "path",
              name: "id",
              required: true,
              description: "The ID of the task to delete",
              schema: {
                type: "integer",
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: "Task deleted successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description: "Confirmation message for task deletion",
                        example: "The task was successfully deleted.",
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            401: {
              $ref: "#/components/responses/401",
            },
            404: {
              $ref: "#/components/responses/404",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
        put: {
          summary: "Update a Task",
          tags: ["Task"],
          description: "Update a task's details by its ID.",
          parameters: [
            {
              in: "header",
              name: "accesstoken",
              required: true,
              description: "JWT access token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
            {
              in: "path",
              name: "id",
              required: true,
              description: "The ID of the task to update",
              schema: {
                type: "integer",
                example: 1,
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Updated title of the task",
                      example: "Updated task title",
                    },
                    description: {
                      type: "string",
                      description: "Updated description of the task",
                      example: "Updated task description",
                    },
                    deadline: {
                      type: "string",
                      format: "date-time",
                      description: "Updated deadline for the task",
                      example: "2024-12-31T23:59:59.999Z",
                    },
                    status: {
                      type: "string",
                      enum: ["Pending", "InProgress", "Completed"],
                      description: "Updated status of the task",
                      example: "InProgress",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Task updated successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task", // استفاده از اسکیما Task
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            401: {
              $ref: "#/components/responses/401",
            },
            404: {
              $ref: "#/components/responses/404",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
        get: {
          summary: "Get a Task by ID",
          tags: ["Task"],
          description: "Retrieve a task's details by its ID.",
          parameters: [
            {
              in: "header",
              name: "accesstoken",
              required: true,
              description: "JWT access token for authentication",
              schema: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
            {
              in: "path",
              name: "id",
              required: true,
              description: "The ID of the task to retrieve",
              schema: {
                type: "integer",
                example: 1,
              },
            },
          ],
          responses: {
            200: {
              description: "Task retrieved successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task", // استفاده از اسکیما Task
                  },
                },
              },
            },
            400: {
              $ref: "#/components/responses/400",
            },
            401: {
              $ref: "#/components/responses/401",
            },
            404: {
              $ref: "#/components/responses/404",
            },
            500: {
              $ref: "#/components/responses/500",
            },
          },
        },
      },
    },
  },
  apis: ["./router/*.js"], // Paths to the API documentation
}
