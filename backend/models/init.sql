CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    loan_amount REAL NOT NULL,
    interest_rate REAL NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    payment_term INTEGER,
    term_unit TEXT,
    total_periods INTEGER,
    interest_type TEXT,
    status TEXT DEFAULT 'active',
    id_customer INTEGER NOT NULL,
    id_contract_type INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_customer) REFERENCES customers(id),
    FOREIGN KEY (id_contract_type) REFERENCES contracts_types(id)
);

CREATE TABLE IF NOT EXISTS contracts_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    cccd TEXT,
    birth_date TEXT,
    images_cccd TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS relatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    cccd TEXT,
    job TEXT,
    workplace TEXT,
    id_customer INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_customer) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS collaterals_type(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collaterals(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NULL,
    name TEXT NOT NULL,
    metadata TEXT DEFAULT '{}',
    status TEXT DEFAULT 'Đang cầm',
    id_contract INTEGER NOT NULL,
    id_collateral_type INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_contract) REFERENCES contracts(id),
    FOREIGN KEY (id_collateral_type) REFERENCES collaterals_type(id)
);

CREATE TABLE IF NOT EXISTS images(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    id_collateral INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_collateral) REFERENCES collaterals(id)
);

CREATE TABLE IF NOT EXISTS payment_schedules(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_number INTEGER NOT NULL,
    from_date TEXT NULL,
    expected_date TEXT NOT NULL,
    principal_amount REAL NOT NULL,
    interest_amount REAL NOT NULL,
    is_paid INTEGER DEFAULT 0,
    id_contract INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_contract) REFERENCES contracts(id)
);

CREATE TABLE IF NOT EXISTS transactions_types(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NULL,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    cccd TEXT,
    id_role INTEGER NOT NULL,
    FOREIGN KEY (id_role) REFERENCES role(id)
);

CREATE TABLE IF NOT EXISTS transactions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    other_fees REAL NULL,
    description TEXT NULL,
    id_contract INTEGER NOT NULL,
    id_schedule INTEGER NULL,
    id_transaction_type INTEGER NOT NULL,
    id_staff INTEGER NOT NULL,
    created_at DATETIME DEFAULT (date('now')),
    FOREIGN KEY (id_contract) REFERENCES contracts(id),
    FOREIGN KEY (id_schedule) REFERENCES payment_schedules(id),
    FOREIGN KEY (id_transaction_type) REFERENCES transactions_types(id),
    FOREIGN KEY (id_staff) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS audit_logs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    id_staff INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_staff) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS permissions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions(
    id_role INTEGER,
    id_permission INTEGER NOT NULL,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES role(id),
    FOREIGN KEY (id_permission) REFERENCES permissions(id)
);

INSERT INTO permissions (name) VALUES
('contract.create'),
('contract.read'),
('contract.detail'),
('contract.print'),
('contract.delete'),
('customer.create'),
('customer.read'),
('customer.detail'),
('customer.update'),
('customer.delete'),
('collateral.create'),
('collateral.read'),
('collateral.detail'),
('collateral.liquidation'),
('collateral.update'),
('collateral.delete'),
('image.create'),
('image.update'),
('image.delete'),
('payment_schedule.read'),
('payment_schedule.update'),
('payment_schedule.delete'),
('transaction.read'),
('transaction.delete'),
('transaction.detail'),
('transaction.reduce'),
('transaction.final'),
('staff.create'),
('staff.read'),
('staff.update'),
('staff.delete'),
('audit_log.read'),
('role_permission.create'),
('role_permission.read'),
('role_permission.update'),
('role_permission.delete');

INSERT INTO role (name) VALUES ('admin'), ('manager'), ('staff');

INSERT INTO role_permissions (id_role, id_permission) VALUES
(2, 1), (2, 2), (2, 3), (2, 4),
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(2, 17), (2, 18), (2, 19), (2, 20);

INSERT INTO transactions_types (name) VALUES 
('Chi cho Vay'), ('Kỳ lãi'), ('Tất toán'), ('Trả bớt gốc');

INSERT INTO contracts_types (name) VALUES 
('Cầm Đồ'), ('Tín Chấp'), ('Trả Góp');

INSERT INTO collaterals_type (name) VALUES 
('Xe máy'), ('Ô tô'), ('Điện thoại'), ('Máy tính'), ('Vàng');

INSERT INTO staff (name, email, password, phone, address, cccd, id_role) VALUES 
('admin', 'pawnadmin@gmail.com', '$2b$10$MzZzlleAClylZEveCMNPvuMe/9ylJj0V3aEa/2lhQxEVoZZ89ZGx2', '0123456789', 'admin', 'admin', 1);

INSERT INTO staff (name, email, password, phone, address, cccd, id_role) VALUES 
('Quản Lý Lỏ', 'staff1@gmail.com', '$2b$10$hahZcDljoDgAKzRmniRJu.32/PxxIfGc27/eF/aUfBNR4L/R4Wj2.', '0123456789', 'staff1', 'staff1', 2);