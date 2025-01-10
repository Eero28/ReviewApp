# Project Overview

## Database Schema

This section describes the key entities and their relationships in the application’s PostgreSQL database.

### **User Entity**

The `User` entity represents a user in the application.

#### Key Features

- `id_user`: A unique, auto-generated identifier for each user.

- **Columns**:
  - `email`: Unique email address for user identification.
  - `password`: Stores the user's hashed password.
  - `username`: The name of the user.
  - `role`: Defines the user's role (default: "user").

- **Relationships**:

  1. **Reviews**: A user can create many reviews (`One-to-Many` relationship).
  
  2. **Comments**: A user can make many comments (`One-to-Many` relationship).
  
  3. **Likes**: A user can like many reviews (`One-to-Many` relationship).
  
  4. **Replies**: A user can make many replies (`One-to-Many` relationship).

### **Review Entity**

The `Review` entity represents a review posted by a user about a product or service.

#### Key Features

- `id_review`: A unique, auto-generated identifier for each review.

- **Columns**:
  - `reviewname`: The name/title of the review.
  - `reviewDescription`: A detailed description of the review.
  - `reviewRating`: The rating given by the user (usually a decimal value).
  - `imageUrl`: A URL pointing to an image associated with the review.
  - `category`: The category of the review (e.g., product, service, etc.).

- **Relationships**:

  1. **User**: Each review is linked to a user who created it (`Many-to-One` relationship).
  
  2. **Comments**: A review can have many comments (`One-to-Many` relationship).
  
  3. **Likes**: A review can have many likes from different users (`One-to-Many` relationship).

### **Comment Entity**

The `Comment` entity represents a comment made by a user on a review.

#### Key Features:

- `id_comment`: A unique, auto-generated identifier for each comment.

- **Columns**:
  - `text`: The content of the comment.
  - `createdAt`: Timestamp of when the comment was created.
  - `updatedAt`: Timestamp of when the comment was last updated.

- **Relationships**:

  1. **Review**: Each comment is associated with a review (`Many-to-One` relationship).
  
  2. **User**: Each comment is made by a user (`Many-to-One` relationship).
  
  3. **Replies**: A comment can have many replies (`One-to-Many` relationship).

### **Like Entity**

The `Like` entity represents a like given by a user to a review.

#### Key Features:

- `id_like`: A unique, auto-generated identifier for each like.

- **Columns**:
  - `likedAt`: Timestamp of when the like was created.

- **Relationships**:

  1. **Review**: Each like is associated with a specific review (`Many-to-One` relationship).
  
  2. **User**: Each like is given by a user (`Many-to-One` relationship).

### **Reply Entity**

The `Reply` entity represents a reply made by a user to a comment.

#### Key Features

- `id_reply`: A unique, auto-generated identifier for each reply.

- **Columns**:
  - `text`: The content of the reply.
  - `createdAt`: Timestamp of when the reply was created.
  - `updatedAt`: Timestamp of when the reply was last updated.

- **Relationships**:

  1. **Comment**: Each reply is associated with a specific comment (`Many-to-One` relationship).
  
  2. **User**: Each reply is made by a user (`Many-to-One` relationship).
