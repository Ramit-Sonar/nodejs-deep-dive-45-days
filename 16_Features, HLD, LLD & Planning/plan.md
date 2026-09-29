# Episode 02 | Features, HLD, LLD & Project Planning

## 🎯 Objective

Plan a software project before coding by identifying its core features, defining system architecture, and breaking the design into implementable components.

## 1. Feature Planning

Features describe **what the system should do** from the user's perspective.

For the **DevTinder** project, core features include:

* 👤 User registration and login
* 📝 Create and update user profiles
* 🔍 Browse and discover other developers
* ❤️ Send and manage connection requests
* 🤝 View accepted connections

### Functional vs. Non-Functional Requirements

* **Functional requirements:** Specific actions the system must support, such as signing up, logging in, and sending connection requests.
* **Non-functional requirements:** Quality expectations, such as security, performance, reliability, and maintainability.

## 2. HLD — High-Level Design

HLD describes the **overall architecture** of a system: its major parts and how they communicate.

### Example: DevTinder HLD

```text
             User
              |
              v
       React Frontend
              |
          HTTP / API
              |
              v
       Node.js + Express
              |
              v
          MongoDB
```

**Main components:**

* **Frontend:** React UI for users to interact with the app.
* **Backend:** Node.js and Express handle API requests and application logic.
* **Database:** MongoDB stores user profiles, connection requests, and related data.
* **API:** Connects the frontend and backend through HTTP requests and responses.

HLD helps answer:

* What are the main components?
* How do they communicate?
* Which technologies and services will be used?
* Where does data flow through the system?

## 3. LLD — Low-Level Design

LLD explains **how individual components will be implemented**. It includes detailed structures, routes, models, and the flow of operations.

### Example: User Login LLD

```text
User submits login form
          |
          v
Frontend sends POST /login
          |
          v
Backend validates input
          |
          v
Find user in MongoDB
          |
          v
Verify password
          |
          v
Return success or error
```

**Possible implementation details:**

* **Route:** `POST /login`
* **Controller:** Receives the request and returns the response.
* **Model:** Defines the user data structure.
* **Validation:** Checks that required input is present and valid.
* **Authentication:** Verifies credentials and creates an authenticated session or token.

## 4. HLD vs. LLD

| HLD                                            | LLD                                          |
| ---------------------------------------------- | -------------------------------------------- |
| Overall system architecture                    | Detailed component design                    |
| Focuses on major modules and their connections | Focuses on how each module works             |
| Identifies technologies and system boundaries  | Defines routes, models, functions, and logic |
| Answers “What are the main parts?”             | Answers “How will each part be built?”       |

## 5. Planning Before Development

1. Identify the problem the project solves.
2. Define the target users and their needs.
3. List and prioritize the core features.
4. Write functional and non-functional requirements.
5. Create the HLD to map the major components.
6. Create the LLD for key features and data flows.
7. Break the work into small development tasks.
8. Implement, test, and refine each feature.

## 💡 Key Takeaways

* **Features** define what users can do with the application.
* **HLD** provides a bird’s-eye view of the system architecture.
* **LLD** provides the detailed implementation plan for each component.
* Planning helps reduce confusion, identify dependencies, and guide development.
* Design is a guide, not a one-time restriction: update it when requirements or technical understanding change.
