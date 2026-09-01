# Card Number Validation API

A simple REST API built with **Node.js, TypeScript, and NestJS** for validating payment card numbers using the **Luhn algorithm**.

The project was built as part of a backend engineering assessment, with a focus on correctness, clean code structure, input validation, error handling, testing, and maintainability.

## Overview

This project provides a single API endpoint that accepts a card number and determines whether the number passes the **Luhn checksum algorithm**.

The API does not communicate with a bank, payment processor, or card network.

A successful validation means that the card number is mathematically valid according to the Luhn algorithm. It does **not** mean that the card:

* Actually exists
* Has been issued by a financial institution
* Is active
* Has sufficient funds
* Can be used for a transaction
* Belongs to a particular person

The goal of this project is to demonstrate a clean and maintainable backend implementation rather than to perform real-world card authorization.

---

## Features

* Card number validation
* Luhn algorithm implementation
* Type-safe TypeScript code
* Strict TypeScript configuration
* Request DTO validation
* Automatic validation using NestJS `ValidationPipe`
* Handling of missing or malformed input
* Support for card numbers containing spaces
* Unexpected request field detection
* Unit tests
* End-to-end API tests
* Clean modular NestJS architecture

---

## Technology Stack

| Technology        | Purpose                           |
| ----------------- | --------------------------------- |
| Node.js           | JavaScript runtime                |
| TypeScript        | Type-safe application development |
| NestJS            | Backend framework                 |
| class-validator   | Request validation                |
| class-transformer | DTO transformation                |
| Vitest            | Test runner                       |
| Supertest         | HTTP/API testing                  |
| Bun               | Package manager and script runner |

---

## Project Structure

```text
card-validator-api/
│
├── src/
│   ├── card/
│   │   ├── dto/
│   │   │   └── validate-card.dto.ts
│   │   │
│   │   ├── card.controller.ts
│   │   ├── card.service.ts
│   │   ├── card.service.spec.ts
│   │   └── card.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
│   └── card.e2e-spec.ts
│
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── ...
```

### `card.controller.ts`

Responsible for handling HTTP requests and responses.

It exposes:

```text
POST /cards/validate
```

The controller receives the request DTO and passes the card number to the service.

### `card.service.ts`

Contains the main business logic for validating card numbers using the Luhn algorithm.

Keeping the validation logic inside the service means the controller remains focused on HTTP concerns.

### `validate-card.dto.ts`

Defines the expected structure of incoming requests and validates the request before it reaches the business logic.

### `card.module.ts`

Groups the card controller and service into a single NestJS feature module.

### `card.service.spec.ts`

Contains unit tests for the card validation logic.

### `card.e2e-spec.ts`

Contains end-to-end tests that test the API through HTTP requests.

---

# Getting Started

## Requirements

Before running the project, make sure you have the following installed:

* Node.js 18+
* Bun

You can verify your installations with:

```bash
node --version
bun --version
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/KhalidMujahid/Card-Number-Validation-API.git
```

Navigate into the project:

```bash
cd Card-Number-Validation-API
```

Install dependencies:

```bash
bun install
```

---

# Running the Application

## Development

Start the application in development mode:

```bash
bun run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## Production Build

Build the application:

```bash
bun run build
```

Start the production build:

```bash
bun run start:prod
```

---

# API Documentation

## Validate Card Number

### Endpoint

```http
POST /cards/validate
```

### Content-Type

```http
Content-Type: application/json
```

---

## Request Format

The endpoint expects a JSON object containing a `cardNumber` field.

Example:

```json
{
  "cardNumber": "4111111111111111"
}
```

The card number is accepted as a string intentionally.

Card numbers should not be represented as JavaScript numbers because card numbers can be long and may contain formatting such as spaces.

Using a string also prevents accidental loss of precision.

---

## Valid Card Number

Example request:

```http
POST /cards/validate
```

```json
{
  "cardNumber": "4111111111111111"
}
```

Example response:

```json
{
  "valid": true
}
```

---

## Invalid Card Number

Example request:

```json
{
  "cardNumber": "4111111111111112"
}
```

Example response:

```json
{
  "valid": false
}
```

A card number that fails the Luhn checksum is considered invalid.

---

## Card Number With Spaces

The API supports card numbers containing spaces.

Example:

```json
{
  "cardNumber": "4111 1111 1111 1111"
}
```

Example response:

```json
{
  "valid": true
}
```

Spaces are removed before the Luhn validation is performed.

---

# Input Validation

The API validates incoming requests before passing them to the card validation service.

The expected field is:

```text
cardNumber
```

It must:

* Exist
* Be a string
* Not be empty

For example, the following request is invalid:

```json
{}
```

The API returns:

```http
400 Bad Request
```

---

## Invalid Data Type

The following request is invalid:

```json
{
  "cardNumber": 4111111111111111
}
```

The API expects the card number to be a string.

The response is:

```http
400 Bad Request
```

---

## Unexpected Fields

The API is configured to reject unexpected properties.

For example:

```json
{
  "cardNumber": "4111111111111111",
  "extraField": "unexpected"
}
```

This request returns:

```http
400 Bad Request
```

This behavior is enabled using NestJS's `ValidationPipe` configuration:

```typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

---

# Validation Approach

## Luhn Algorithm

The project uses the **Luhn algorithm** to validate card numbers.

The algorithm works by processing the digits from right to left.

For every second digit:

1. Double the digit.
2. If the result is greater than 9, subtract 9.
3. Add the resulting values together.
4. If the final sum is divisible by 10, the number passes the Luhn check.

For example:

```text
4111111111111111
```

passes the Luhn checksum.

While:

```text
4111111111111112
```

does not.

---

## Why Luhn?

The Luhn algorithm was chosen because:

* It is commonly used for payment card number checksum validation.
* It is deterministic.
* It does not require an external API.
* It is simple enough to understand and test.
* It keeps the implementation self-contained.

The algorithm only validates the mathematical structure of the number.

It does not perform actual payment-card verification.

---

# Error Handling

The API distinguishes between **invalid input** and a **card number that fails validation**.

### Malformed request

For example:

```json
{}
```

returns:

```http
400 Bad Request
```

because the request itself does not satisfy the API contract.

### Valid request containing an invalid card number

For example:

```json
{
  "cardNumber": "4111111111111112"
}
```

returns:

```http
200 OK
```

with:

```json
{
  "valid": false
}
```

The request was valid and successfully processed; the card number simply failed the Luhn check.

---

# Testing

The project includes both unit and end-to-end tests.

## Run Unit Tests

```bash
bun run test
```

Unit tests verify the card validation service independently from the HTTP layer.

Examples include:

* Valid card numbers
* Invalid card numbers
* Card numbers containing spaces
* Non-numeric input

---

## Run End-to-End Tests

```bash
bun run test:e2e
```

The e2e tests verify the complete API flow.

They test:

* Valid card number
* Invalid card number
* Card number containing spaces
* Missing card number
* Incorrect card number type
* Unexpected request fields

The e2e tests exercise the application through HTTP rather than directly calling the service.

---

## Run Tests in Watch Mode

```bash
bun run test:watch
```

---

# Design Decisions

## 1. Why NestJS?

NestJS was chosen because it provides a structured architecture based around:

* Modules
* Controllers
* Services
* Dependency injection

This makes the application easy to understand and allows the project to remain maintainable as it grows.

---

## 2. Why TypeScript?

TypeScript provides static typing and improves code reliability.

The project also uses:

```json
{
  "strict": true
}
```

This enables stricter compile-time checks and helps identify potential type-related problems during development.

---

## 3. Why a DTO?

The DTO defines the API's expected request structure.

Instead of allowing arbitrary request data into the application, the DTO provides a clear contract:

```typescript
{
  cardNumber: string;
}
```

This also allows NestJS and `class-validator` to handle request validation before the business logic executes.

---

## 4. Why keep the algorithm in the service?

The controller is responsible for HTTP concerns, while the service contains the business logic.

This separation makes the code easier to:

* Test
* Read
* Maintain
* Modify

It also means the validation logic isn't tightly coupled to HTTP.

---

## 5. Why use POST?

The endpoint receives a card number as request data.

Using POST allows the card number to be sent in the request body rather than exposing it as part of the URL.

Example:

```http
POST /cards/validate
```

with:

```json
{
  "cardNumber": "4111111111111111"
}
```

---

## 6. Why return `valid: false` instead of `400`?

There is an important distinction between an invalid request and an invalid card number.

This is a valid API request:

```json
{
  "cardNumber": "4111111111111112"
}
```

The request has the correct structure and type, so the server can successfully process it.

The result is simply:

```json
{
  "valid": false
}
```

On the other hand, this is an invalid request:

```json
{}
```

because the required `cardNumber` field is missing.

Therefore, it returns:

```http
400 Bad Request
```

---

## 7. Why accept spaces?

Card numbers are commonly displayed in groups:

```text
4111 1111 1111 1111
```

Allowing spaces makes the API more user-friendly.

The spaces are removed before validation, while the original input format does not need to be modified by the client.

---

# Limitations

This API performs checksum validation only.

It does not:

* Verify that a card was actually issued
* Check whether a card is active
* Check available balance
* Verify CVV
* Verify expiration date
* Identify the cardholder
* Contact a bank or payment processor
* Authorize transactions
* Guarantee that a card can be used for payment

A number passing the Luhn algorithm should therefore be interpreted as:

> "The card number has a valid checksum."

Not:

> "This is a real and usable card."

---

# Development

The application follows a simple feature-based NestJS structure.

The main request flow is:

```text
HTTP Request
     │
     ▼
Card Controller
     │
     ▼
DTO Validation
     │
     ▼
Card Service
     │
     ▼
Luhn Algorithm
     │
     ▼
Validation Result
     │
     ▼
HTTP Response
```

This keeps responsibilities separated without introducing unnecessary abstractions for a small application.

---

# Available Scripts

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `bun run start`      | Start the application           |
| `bun run start:dev`  | Start in development/watch mode |
| `bun run start:prod` | Start the production build      |
| `bun run build`      | Build the application           |
| `bun run test`       | Run unit tests                  |
| `bun run test:watch` | Run tests in watch mode         |
| `bun run test:e2e`   | Run end-to-end tests            |
| `bun run lint`       | Run ESLint                      |

---

# API Example

Using cURL:

```bash
curl -X POST http://localhost:3000/cards/validate \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"4111111111111111"}'
```

Response:

```json
{
  "valid": true
}
```

---

# License

This project was created for a backend engineering assessment.

---

# Author

**Khalid Zikirullah**

Backend / Software Developer
