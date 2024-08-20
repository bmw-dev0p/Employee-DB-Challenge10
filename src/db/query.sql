SELECT
    employees.first_name AS name, roles.role_id AS role
FROM employees
JOIN roles ON employees.role_id = roles.id;