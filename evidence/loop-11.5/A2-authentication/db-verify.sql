SELECT c.id, c.name, c."companyId" 
FROM "Customer" c 
JOIN "Company" comp ON c."companyId" = comp.id 
WHERE comp.name = 'Company A';
