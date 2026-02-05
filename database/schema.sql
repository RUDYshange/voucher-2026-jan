CREATE TABLE vouchers (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    value DECIMAL(10, 2) NOT NULL,
    retailer VARCHAR(255) NOT NULL,
    expiry_date DATE NOT NULL
);

CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE voucher_categories (
    voucher_id INT,
    category_id INT,
    PRIMARY KEY (voucher_id, category_id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);