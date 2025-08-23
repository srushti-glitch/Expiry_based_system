create database Expiry_based_dyanamic_discount_system
use Expiry_based_dyanamic_discount_system

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    base_price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    discount_percent DECIMAL(5,2),
    manufacture_date DATE,
    expiry_date DATE NOT NULL,
    quantity INT DEFAULT 0,
    image_url TEXT
);
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discount_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    days_to_expiry INT NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100), -- or user_id if login is used
    product_id INT,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(100),
    total_amount DECIMAL(10,2)
);
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    message TEXT,
    alert_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheduler_time TIME,
    email_alerts_enabled BOOLEAN DEFAULT TRUE,
    sms_alerts_enabled BOOLEAN DEFAULT FALSE
);
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    activity TEXT,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);









