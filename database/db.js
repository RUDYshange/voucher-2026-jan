const { Client } = require('pg');

const client = new Client({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

// Function to insert vouchers
async function insertVouchers(vouchers) {
    const query = 'INSERT INTO vouchers (id, name, description, value, retailer, expiry_date) VALUES ($1, $2, $3, $4, $5, $6)';
    for (const voucher of vouchers) {
        await client.query(query, [voucher.id, voucher.name, voucher.description, voucher.value, voucher.retailer, voucher.expiry_date]);
    }
}

// Function to insert categories
async function insertCategories(categories) {
    const query = 'INSERT INTO categories (id, name) VALUES ($1, $2)';
    for (const category of categories) {
        await client.query(query, [category.id, category.name]);
    }
}

// Function to insert voucher categories
async function insertVoucherCategories(voucherCategories) {
    const query = 'INSERT INTO voucher_categories (voucher_id, category_id) VALUES ($1, $2)';
    for (const vc of voucherCategories) {
        await client.query(query, [vc.voucher_id, vc.category_id]);
    }
}

// Call the functions with your data
// insertVouchers(vouchersData);
// insertCategories(categoriesData);
// insertVoucherCategories(voucherCategoriesData);
