SELECT p.id, p.amount, p."invoiceId", p."paymentDate"
FROM "Payment" p
WHERE p."invoiceId" = 'c7a3df4e-4c58-4b41-812c-e904a8fa04f5';
