# HONEST Module Audit Evidence

### admin
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/admin --include=*.ts | wc -l
72
$ find apps/api/src/admin apps/api/test -name "*admin*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/admin --include=*.ts | grep -c companyId
3
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/admin --include=*.ts | wc -l
2
```

### ai
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/ai --include=*.ts | wc -l
31
$ find apps/api/src/ai apps/api/test -name "*ai*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/ai --include=*.ts | grep -c companyId
4
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/ai --include=*.ts | wc -l
1
```

### analytics
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/analytics --include=*.ts | wc -l
0
$ find apps/api/src/analytics apps/api/test -name "*analytics*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/analytics --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/analytics --include=*.ts | wc -l
1
```

### api-analytics
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/api-analytics --include=*.ts | wc -l
0
$ find apps/api/src/api-analytics apps/api/test -name "*api-analytics*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/api-analytics --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/api-analytics --include=*.ts | wc -l
0
```

### api-platform
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/api-platform --include=*.ts | wc -l
14
$ find apps/api/src/api-platform apps/api/test -name "*api-platform*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/api-platform --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/api-platform --include=*.ts | wc -l
4
```

### auth
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/auth --include=*.ts | wc -l
55
$ find apps/api/src/auth apps/api/test -name "*auth*spec.ts" 2>/dev/null | wc -l
2
$ grep -rn -A2 "runAsSystem(" apps/api/src/auth --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/auth --include=*.ts | wc -l
4
```

### automation
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/automation --include=*.ts | wc -l
0
$ find apps/api/src/automation apps/api/test -name "*automation*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/automation --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/automation --include=*.ts | wc -l
0
```

### background-jobs
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/background-jobs --include=*.ts | wc -l
0
$ find apps/api/src/background-jobs apps/api/test -name "*background-jobs*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/background-jobs --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/background-jobs --include=*.ts | wc -l
1
```

### billing
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/billing --include=*.ts | wc -l
32
$ find apps/api/src/billing apps/api/test -name "*billing*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/billing --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/billing --include=*.ts | wc -l
2
```

### branches
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/branches --include=*.ts | wc -l
0
$ find apps/api/src/branches apps/api/test -name "*branches*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/branches --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/branches --include=*.ts | wc -l
1
```

### broker
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/broker --include=*.ts | wc -l
0
$ find apps/api/src/broker apps/api/test -name "*broker*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/broker --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/broker --include=*.ts | wc -l
1
```

### chat
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/chat --include=*.ts | wc -l
0
$ find apps/api/src/chat apps/api/test -name "*chat*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/chat --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/chat --include=*.ts | wc -l
1
```

### comments
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/comments --include=*.ts | wc -l
0
$ find apps/api/src/comments apps/api/test -name "*comments*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/comments --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/comments --include=*.ts | wc -l
1
```

### commercial
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/commercial --include=*.ts | wc -l
0
$ find apps/api/src/commercial apps/api/test -name "*commercial*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/commercial --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/commercial --include=*.ts | wc -l
1
```

### common
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/common --include=*.ts | wc -l
1
$ find apps/api/src/common apps/api/test -name "*common*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/common --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/common --include=*.ts | wc -l
0
```

### communications
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/communications --include=*.ts | wc -l
39
$ find apps/api/src/communications apps/api/test -name "*communications*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/communications --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/communications --include=*.ts | wc -l
6
```

### companies
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/companies --include=*.ts | wc -l
0
$ find apps/api/src/companies apps/api/test -name "*companies*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/companies --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/companies --include=*.ts | wc -l
1
```

### config
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/config --include=*.ts | wc -l
0
$ find apps/api/src/config apps/api/test -name "*config*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/config --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/config --include=*.ts | wc -l
0
```

### crm
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/crm --include=*.ts | wc -l
0
$ find apps/api/src/crm apps/api/test -name "*crm*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/crm --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/crm --include=*.ts | wc -l
1
```

### customers
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/customers --include=*.ts | wc -l
0
$ find apps/api/src/customers apps/api/test -name "*customers*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/customers --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/customers --include=*.ts | wc -l
1
```

### dashboard
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/dashboard --include=*.ts | wc -l
5
$ find apps/api/src/dashboard apps/api/test -name "*dashboard*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/dashboard --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/dashboard --include=*.ts | wc -l
4
```

### data-lifecycle
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/data-lifecycle --include=*.ts | wc -l
0
$ find apps/api/src/data-lifecycle apps/api/test -name "*data-lifecycle*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/data-lifecycle --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/data-lifecycle --include=*.ts | wc -l
0
```

### data
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/data --include=*.ts | wc -l
0
$ find apps/api/src/data apps/api/test -name "*data*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/data --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/data --include=*.ts | wc -l
1
```

### developer
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/developer --include=*.ts | wc -l
0
$ find apps/api/src/developer apps/api/test -name "*developer*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/developer --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/developer --include=*.ts | wc -l
1
```

### dispatch
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/dispatch --include=*.ts | wc -l
31
$ find apps/api/src/dispatch apps/api/test -name "*dispatch*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/dispatch --include=*.ts | grep -c companyId
1
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/dispatch --include=*.ts | wc -l
3
```

### documents
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/documents --include=*.ts | wc -l
29
$ find apps/api/src/documents apps/api/test -name "*documents*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/documents --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/documents --include=*.ts | wc -l
3
```

### drivers
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/drivers --include=*.ts | wc -l
36
$ find apps/api/src/drivers apps/api/test -name "*drivers*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/drivers --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/drivers --include=*.ts | wc -l
2
```

### dto
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/dto --include=*.ts | wc -l
0
$ find apps/api/src/dto apps/api/test -name "*dto*spec.ts" 2>/dev/null | wc -l
2
$ grep -rn -A2 "runAsSystem(" apps/api/src/dto --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/dto --include=*.ts | wc -l
0
```

### edi
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/edi --include=*.ts | wc -l
0
$ find apps/api/src/edi apps/api/test -name "*edi*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/edi --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/edi --include=*.ts | wc -l
0
```

### exports
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/exports --include=*.ts | wc -l
2
$ find apps/api/src/exports apps/api/test -name "*exports*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/exports --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/exports --include=*.ts | wc -l
1
```

### factoring
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/factoring --include=*.ts | wc -l
0
$ find apps/api/src/factoring apps/api/test -name "*factoring*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/factoring --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/factoring --include=*.ts | wc -l
1
```

### fastag
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/fastag --include=*.ts | wc -l
0
$ find apps/api/src/fastag apps/api/test -name "*fastag*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/fastag --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/fastag --include=*.ts | wc -l
1
```

### finance
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/finance --include=*.ts | wc -l
0
$ find apps/api/src/finance apps/api/test -name "*finance*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/finance --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/finance --include=*.ts | wc -l
8
```

### fleet
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/fleet --include=*.ts | wc -l
0
$ find apps/api/src/fleet apps/api/test -name "*fleet*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/fleet --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/fleet --include=*.ts | wc -l
3
```

### fuel
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/fuel --include=*.ts | wc -l
0
$ find apps/api/src/fuel apps/api/test -name "*fuel*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/fuel --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/fuel --include=*.ts | wc -l
0
```

### gst
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/gst --include=*.ts | wc -l
0
$ find apps/api/src/gst apps/api/test -name "*gst*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/gst --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/gst --include=*.ts | wc -l
1
```

### health
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/health --include=*.ts | wc -l
0
$ find apps/api/src/health apps/api/test -name "*health*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/health --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/health --include=*.ts | wc -l
1
```

### iam
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/iam --include=*.ts | wc -l
25
$ find apps/api/src/iam apps/api/test -name "*iam*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/iam --include=*.ts | grep -c companyId
1
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/iam --include=*.ts | wc -l
1
```

### integration
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/integration --include=*.ts | wc -l
53
$ find apps/api/src/integration apps/api/test -name "*integration*spec.ts" 2>/dev/null | wc -l
2
$ grep -rn -A2 "runAsSystem(" apps/api/src/integration --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/integration --include=*.ts | wc -l
8
```

### integrations
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/integrations --include=*.ts | wc -l
8
$ find apps/api/src/integrations apps/api/test -name "*integrations*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/integrations --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/integrations --include=*.ts | wc -l
3
```

### intelligence
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/intelligence --include=*.ts | wc -l
6
$ find apps/api/src/intelligence apps/api/test -name "*intelligence*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/intelligence --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/intelligence --include=*.ts | wc -l
7
```

### invoices
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/invoices --include=*.ts | wc -l
0
$ find apps/api/src/invoices apps/api/test -name "*invoices*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/invoices --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/invoices --include=*.ts | wc -l
1
```

### ledger
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/ledger --include=*.ts | wc -l
0
$ find apps/api/src/ledger apps/api/test -name "*ledger*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/ledger --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/ledger --include=*.ts | wc -l
1
```

### lifecycle
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/lifecycle --include=*.ts | wc -l
0
$ find apps/api/src/lifecycle apps/api/test -name "*lifecycle*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/lifecycle --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/lifecycle --include=*.ts | wc -l
0
```

### loads
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/loads --include=*.ts | wc -l
0
$ find apps/api/src/loads apps/api/test -name "*loads*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/loads --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/loads --include=*.ts | wc -l
1
```

### localization
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/localization --include=*.ts | wc -l
0
$ find apps/api/src/localization apps/api/test -name "*localization*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/localization --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/localization --include=*.ts | wc -l
1
```

### lorry-receipts
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/lorry-receipts --include=*.ts | wc -l
0
$ find apps/api/src/lorry-receipts apps/api/test -name "*lorry-receipts*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/lorry-receipts --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/lorry-receipts --include=*.ts | wc -l
1
```

### maintenance
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/maintenance --include=*.ts | wc -l
0
$ find apps/api/src/maintenance apps/api/test -name "*maintenance*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/maintenance --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/maintenance --include=*.ts | wc -l
1
```

### marketplace
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/marketplace --include=*.ts | wc -l
0
$ find apps/api/src/marketplace apps/api/test -name "*marketplace*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/marketplace --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/marketplace --include=*.ts | wc -l
3
```

### mobile
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/mobile --include=*.ts | wc -l
0
$ find apps/api/src/mobile apps/api/test -name "*mobile*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/mobile --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/mobile --include=*.ts | wc -l
1
```

### operations
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/operations --include=*.ts | wc -l
0
$ find apps/api/src/operations apps/api/test -name "*operations*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/operations --include=*.ts | grep -c companyId
12
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/operations --include=*.ts | wc -l
10
```

### optimization
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/optimization --include=*.ts | wc -l
10
$ find apps/api/src/optimization apps/api/test -name "*optimization*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/optimization --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/optimization --include=*.ts | wc -l
2
```

### payments
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/payments --include=*.ts | wc -l
0
$ find apps/api/src/payments apps/api/test -name "*payments*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/payments --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/payments --include=*.ts | wc -l
1
```

### planning
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/planning --include=*.ts | wc -l
0
$ find apps/api/src/planning apps/api/test -name "*planning*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/planning --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/planning --include=*.ts | wc -l
1
```

### platform
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/platform --include=*.ts | wc -l
56
$ find apps/api/src/platform apps/api/test -name "*platform*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/platform --include=*.ts | grep -c companyId
2
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/platform --include=*.ts | wc -l
3
```

### plugins
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/plugins --include=*.ts | wc -l
0
$ find apps/api/src/plugins apps/api/test -name "*plugins*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/plugins --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/plugins --include=*.ts | wc -l
0
```

### portals
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/portals --include=*.ts | wc -l
0
$ find apps/api/src/portals apps/api/test -name "*portals*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/portals --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/portals --include=*.ts | wc -l
13
```

### prisma
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/prisma --include=*.ts | wc -l
0
$ find apps/api/src/prisma apps/api/test -name "*prisma*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/prisma --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/prisma --include=*.ts | wc -l
0
```

### profitability
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/profitability --include=*.ts | wc -l
0
$ find apps/api/src/profitability apps/api/test -name "*profitability*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/profitability --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/profitability --include=*.ts | wc -l
1
```

### reporting
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/reporting --include=*.ts | wc -l
4
$ find apps/api/src/reporting apps/api/test -name "*reporting*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/reporting --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/reporting --include=*.ts | wc -l
1
```

### reports
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/reports --include=*.ts | wc -l
0
$ find apps/api/src/reports apps/api/test -name "*reports*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/reports --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/reports --include=*.ts | wc -l
1
```

### roles
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/roles --include=*.ts | wc -l
0
$ find apps/api/src/roles apps/api/test -name "*roles*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/roles --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/roles --include=*.ts | wc -l
1
```

### saas
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/saas --include=*.ts | wc -l
1
$ find apps/api/src/saas apps/api/test -name "*saas*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/saas --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/saas --include=*.ts | wc -l
4
```

### sandbox
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/sandbox --include=*.ts | wc -l
3
$ find apps/api/src/sandbox apps/api/test -name "*sandbox*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/sandbox --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/sandbox --include=*.ts | wc -l
1
```

### sdk
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/sdk --include=*.ts | wc -l
2
$ find apps/api/src/sdk apps/api/test -name "*sdk*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/sdk --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/sdk --include=*.ts | wc -l
1
```

### search
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/search --include=*.ts | wc -l
1
$ find apps/api/src/search apps/api/test -name "*search*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/search --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/search --include=*.ts | wc -l
1
```

### simulator
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/simulator --include=*.ts | wc -l
2
$ find apps/api/src/simulator apps/api/test -name "*simulator*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/simulator --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/simulator --include=*.ts | wc -l
1
```

### support
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/support --include=*.ts | wc -l
0
$ find apps/api/src/support apps/api/test -name "*support*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/support --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/support --include=*.ts | wc -l
1
```

### telemetry
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/telemetry --include=*.ts | wc -l
0
$ find apps/api/src/telemetry apps/api/test -name "*telemetry*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/telemetry --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/telemetry --include=*.ts | wc -l
0
```

### tracking
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/tracking --include=*.ts | wc -l
40
$ find apps/api/src/tracking apps/api/test -name "*tracking*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/tracking --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/tracking --include=*.ts | wc -l
2
```

### trailers
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/trailers --include=*.ts | wc -l
0
$ find apps/api/src/trailers apps/api/test -name "*trailers*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/trailers --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/trailers --include=*.ts | wc -l
1
```

### trips
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/trips --include=*.ts | wc -l
42
$ find apps/api/src/trips apps/api/test -name "*trips*spec.ts" 2>/dev/null | wc -l
1
$ grep -rn -A2 "runAsSystem(" apps/api/src/trips --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/trips --include=*.ts | wc -l
1
```

### users
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/users --include=*.ts | wc -l
0
$ find apps/api/src/users apps/api/test -name "*users*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/users --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/users --include=*.ts | wc -l
1
```

### vehicles
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/vehicles --include=*.ts | wc -l
0
$ find apps/api/src/vehicles apps/api/test -name "*vehicles*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/vehicles --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/vehicles --include=*.ts | wc -l
6
```

### vendors
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/vendors --include=*.ts | wc -l
0
$ find apps/api/src/vendors apps/api/test -name "*vendors*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/vendors --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/vendors --include=*.ts | wc -l
2
```

### warehouse
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/warehouse --include=*.ts | wc -l
1
$ find apps/api/src/warehouse apps/api/test -name "*warehouse*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/warehouse --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/warehouse --include=*.ts | wc -l
1
```

### wms
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/wms --include=*.ts | wc -l
0
$ find apps/api/src/wms apps/api/test -name "*wms*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/wms --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/wms --include=*.ts | wc -l
1
```

### workflow
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/workflow --include=*.ts | wc -l
51
$ find apps/api/src/workflow apps/api/test -name "*workflow*spec.ts" 2>/dev/null | wc -l
3
$ grep -rn -A2 "runAsSystem(" apps/api/src/workflow --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/workflow --include=*.ts | wc -l
1
```

### workspace
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/workspace --include=*.ts | wc -l
0
$ find apps/api/src/workspace apps/api/test -name "*workspace*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/workspace --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/workspace --include=*.ts | wc -l
1
```

### yard
```bash
$ grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/yard --include=*.ts | wc -l
0
$ find apps/api/src/yard apps/api/test -name "*yard*spec.ts" 2>/dev/null | wc -l
0
$ grep -rn -A2 "runAsSystem(" apps/api/src/yard --include=*.ts | grep -c companyId
0
$ grep -rln "@Controller\|@Get\|@Post" apps/api/src/yard --include=*.ts | wc -l
1
```

