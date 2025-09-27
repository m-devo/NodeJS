CREATE TABLE users(
    id INT PRIMARY KEY auto_increment,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    age INT NOT NULL,
    created_at TIMESTAMP DEFAULT current_timestamp
)