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
    from_date TEXT NOT NULL,
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
    id_contract INTEGER NOT NULL,
    id_schedule INTEGER NULL,
    id_transaction_type INTEGER NOT NULL,
    id_staff INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    id_role INTEGER PRIMARY KEY AUTOINCREMENT,
    id_permission INTEGER NOT NULL,
    FOREIGN KEY (id_role) REFERENCES role(id),
    FOREIGN KEY (id_permission) REFERENCES permissions(id)
);
