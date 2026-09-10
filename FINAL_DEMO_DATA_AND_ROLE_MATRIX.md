# Sanket 2.0 — Final Demo Data & Role Matrix

This package includes a deterministic Indian public-service prototype dataset for demonstration. It is **not live government deployment data** and contains no real citizen PII.

## Demo roles
- Clerk: `ramesh`, `sita`, `amit`, `neha`, `arjun`, `pooja`, `rahul`, `kavya`, `imran`, `meena`, `vikas`, `anita`
- Department Admin: `wateradmin`
- Organisation Admin: `orgadmin`
- State Admin: `stateadmin`
- National Admin: `nationaladmin`
- Super Admin: `admin`
- Interpreter: `interpreter`

Password for demo login and DB seed: `demo123`

## Departments
Water, Property, Citizen Certificates, Grievance & Complaints, Revenue, Public Health, Education, Social Welfare, General Citizen Services, Transport Assistance, Electricity & Utility Assistance, Public Information & Applications.

## Data provenance
Department/service workflows are prototype configuration based on common Indian public-service scenarios. ISL content/assets must retain their upstream license and attribution; do not claim that prototype emoji or synthetic examples are official ISL. No private citizen records are included.

## Seed
Set `MONGODB_URI`, then run `npm run seed`. The script is idempotent/upsert-based.
