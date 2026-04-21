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
    id_staff INTEGER NOT NULL,
    id_customer INTEGER NOT NULL,
    id_contract_type INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_staff) REFERENCES staff(id),
    FOREIGN KEY (id_customer) REFERENCES customers(id),
    FOREIGN KEY (id_contract_type) REFERENCES contracts_types(id)
);

CREATE TABLE IF NOT EXISTS contracts_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    cccd TEXT,
    birth_date TEXT,
    images_cccd TEXT,
    images_cccd_back TEXT,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
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
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_customer) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS collaterals_type(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS collaterals(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NULL,
    name TEXT NOT NULL,
    metadata TEXT DEFAULT '{}',
    status TEXT DEFAULT 'Đang cầm',
    notified_liquidation_at DATETIME NULL,
    id_contract INTEGER NOT NULL,
    id_collateral_type INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_contract) REFERENCES contracts(id),
    FOREIGN KEY (id_collateral_type) REFERENCES collaterals_type(id)
);

CREATE TABLE IF NOT EXISTS images(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    id_collateral INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
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
    notified_overdue_at DATETIME NULL,
    notified_due_today_at DATETIME NULL,
    notified_reminder_early_at DATETIME NULL,
    id_contract INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_contract) REFERENCES contracts(id)
);

CREATE TABLE IF NOT EXISTS transactions_types(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS role(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS staff(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NULL,
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
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
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
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_staff) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS permissions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions(
    id_role INTEGER,
    id_permission INTEGER NOT NULL,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES role(id),
    FOREIGN KEY (id_permission) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS contract_history(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    old_principal REAL NULL,
    new_principal REAL NULL,
    old_interest_rate REAL NULL,
    new_interest_rate REAL NULL,
    type TEXT NOT NULL,
    id_contract INTEGER NOT NULL,
    id_staff INTEGER NOT NULL,
    id_transaction INTEGER NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (id_contract) REFERENCES contracts(id),
    FOREIGN KEY (id_staff) REFERENCES staff(id),
    FOREIGN KEY (id_transaction) REFERENCES transactions(id)
);

CREATE TABLE IF NOT EXISTS settings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS templates(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_file TEXT NOT NULL,
    file_path TEXT NOT NULL,
    type TEXT NOT NULL,
    active TEXT DEFAULT 'true',
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

INSERT OR IGNORE INTO settings (key, value) VALUES
('overdue', 'true'),
('dueToday', 'true'),
('newContract', 'false'),
('liquidation', 'true'),
('emailEnabled', 'false'),
('zaloEnabled', 'true'),
('reminderDays', '3'),
('reminderTime', '08:00'),
('email_sender', ''),
('email_password', '');

INSERT OR IGNORE INTO permissions (name) VALUES
('loans.create'),
('loans.read'),
('loans.detail'),
('loans.print'),
('loans.interest_payment'),
('loans.reduce_principal'),
('loans.final_settlement'),
('pledge.create'),
('pledge.read'),
('pledge.detail'),
('pledge.print'),
('pledge.interest_payment'),
('pledge.reduce_principal'),
('pledge.final_settlement'),
('repayment.create'),
('repayment.read'),
('repayment.detail'),
('repayment.print'),
('repayment.interest_payment'),
('repayment.reduce_principal'),
('repayment.final_settlement'),
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
('staff.detail'),
('staff.update'),
('staff.delete'),
('audit_log.read'),
('role_permission.create'),
('role_permission.read'),
('role_permission.update'),
('role_permission.delete')
;

INSERT OR IGNORE INTO role (name) VALUES ('admin'), ('manager'), ('staff');

INSERT OR IGNORE INTO role_permissions (id_role, id_permission) VALUES
(2, 1), (2, 2), (2, 3), (2, 4),
(2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
(2, 17), (2, 18), (2, 19), (2, 20);

INSERT OR IGNORE INTO transactions_types (name) VALUES 
('Chi cho Vay'), ('Kỳ lãi'), ('Tất toán'), ('Trả bớt gốc'), ('Thanh lý tài sản');

INSERT OR IGNORE INTO contracts_types (name) VALUES 
('Cầm Đồ'), ('Tín Chấp'), ('Trả Góp');

INSERT OR IGNORE INTO collaterals_type (name) VALUES 
('Xe máy'), ('Ô tô'), ('Điện thoại'), ('Máy tính'), ('Vàng');

INSERT OR IGNORE INTO staff (name, email, password, phone, address, cccd, id_role) VALUES 
('admin', 'pawnadmin@gmail.com', '$2b$10$MzZzlleAClylZEveCMNPvuMe/9ylJj0V3aEa/2lhQxEVoZZ89ZGx2', '0123456789', 'admin', 'admin', 1);

INSERT INTO staff (name, email, password, phone, address, cccd, id_role) VALUES 
('Quản Lý Lỏ', 'staff1@gmail.com', '$2b$10$hahZcDljoDgAKzRmniRJu.32/PxxIfGc27/eF/aUfBNR4L/R4Wj2.', '0123456789', 'staff1', 'staff1', 2);