
# Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Módulos principales](#módulos-principales)
  - [Admin](#admin)
  - [Compañías](#compañías)
  - [Clientes](#clientes)
  - [Trabajadores](#trabajadores)
  - [Mailing](#mailing)p
  - [Payments](#payments)
  - [Ficheros](#ficheros)
- [Tecnologías usadas](#tecnologías-usadas)

## Descripción del proyecto
Este  es el bakend del proyecto trata sobre una aplicación web que permite a las empresas gestionar tanto a sus clientes como a sus trabajadores,
incluyendo pagos en tiempo real y gráficos que se actualizan conforme se van actualizando los datos en la base de datos.

## Estructura del proyecto
```bash
.
├── admin
│   ├── admin.controller.spec.ts
│   ├── admin.controller.ts
│   ├── admin.guard.spec.ts
│   ├── admin.guard.ts
│   ├── admin.module.ts
│   └── admin.services.ts
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── auth
│   ├── auth.controller.ts
│   ├── auth.guard.ts
│   ├── auth.module.ts
│   └── auth.services.ts
├── company
│   ├── company1.controller.spec.ts
│   ├── company.controller.spec.ts
│   ├── company.controller.ts
│   ├── company.guard.spec.ts
│   ├── company.guard.ts
│   ├── company.module.ts
│   └── company.service.ts
├── constants
│   └── ALLOWED_FILES.ts
├── mailing
│   ├── mailing.controller.spec.ts
│   ├── mailing.controller.ts
│   ├── mailing.module.ts
│   ├── mailing.service.spec.ts
│   └── mailing.service.ts
├── main.ts
├── modules
│   ├── admin
│   │   ├── activateCompany.ts
│   │   ├── adminLogin.ts
│   │   ├── charts
│   │   │   ├── activeClients.ts
│   │   │   ├── activeCompanies.ts
│   │   │   └── activeIncidents.ts
│   │   ├── consultStatus.ts
│   │   ├── editCompany.ts
│   │   ├── eliminateCompany.ts
│   │   ├── listCompany.ts
│   │   ├── registerAdmin.ts
│   │   └── suspendCompany.ts
│   ├── budgets
│   │   ├── calculateAmmount.ts
│   │   └── createbudget.ts
│   ├── charts
│   │   └── companyCharts
│   │       ├── closedIncidents.ts
│   │       └── companyEarnings.ts
│   ├── companies
│   │   ├── assignShiftWorker.ts
│   │   ├── assignUserCompany.ts
│   │   ├── companyLogin.ts
│   │   ├── companyUsers.ts
│   │   ├── createUser.ts
│   │   ├── getClientContracts.ts
│   │   ├── listClients.ts
│   │   ├── listIncidents.ts
│   │   ├── listWorkers.ts
│   │   ├── registerCompany.ts
│   │   └── updateTypeContractType.ts
│   ├── directions
│   │   ├── getDirections.ts
│   │   └── registerDirections.ts
│   ├── incidents
│   │   ├── assignIncident.ts
│   │   ├── createIncident.ts
│   │   ├── getIncidentHistory.ts
│   │   └── incidentHistory.ts
│   ├── machinery
│   │   ├── createMachinery.ts
│   │   ├── editMachinery.ts
│   │   ├── eliminateMachinery.ts
│   │   ├── findMymachinery.ts
│   │   ├── listMachinery.ts
│   │   └── updateMaintenceDate.ts
│   ├── mailing
│   │   ├── emailTemplates
│   │   │   ├── templateBudget.html
│   │   │   ├── templateBudgetPaid.html
│   │   │   ├── templateCompanyData.html
│   │   │   ├── templateincident.html
│   │   │   ├── templateMachinery.html
│   │   │   ├── templateNewsLetter.html
│   │   │   ├── templateRegisterClient.html
│   │   │   ├── templateSubcribe.html
│   │   │   └── templateWorkerCredentials.html
│   │   ├── getSubcribers.ts
│   │   ├── sendBudgetEmail.ts
│   │   ├── sendClientCredentials.ts
│   │   ├── sendCompanyCredentials.ts
│   │   ├── sendIncidentEmail.ts
│   │   ├── sendMachineryEmail.ts
│   │   ├── sendNewsLetter.ts
│   │   ├── sendPaymentConfirmation.ts
│   │   ├── sendSubcribeEmail.ts
│   │   ├── sentWorkerCredentials.ts
│   │   └── subcribe.ts
│   ├── payments
│   │   └── subscriptions
│   │       ├── accounts
│   │       │   ├── createAccount.ts
│   │       │   └── createLoginLink.ts
│   │       ├── createSubcription.ts
│   │       ├── payments
│   │       │   ├── createCheckoutsession.ts
│   │       │   └── createPayment.ts
│   │       ├── products
│   │       │   └── createProduct.ts
│   │       └── saveSubcription.ts
│   ├── users
│   │   ├── hireCompany.ts
│   │   ├── Mycontracts.ts
│   │   ├── myIncidents.ts
│   │   ├── recievedBudgets.ts
│   │   ├── searchCompanies.ts
│   │   ├── userLogin.ts
│   │   └── userRegister.ts
│   └── workers
│       ├── editWorker.ts
│       ├── eliminateWorker.ts
│       ├── getIncidentPhotos.ts
│       ├── listAssignedIncidents.ts
│       ├── myShifts.ts
│       ├── registerWorker.ts
│       ├── updateStatusIncident.ts
│       └── workerLogin.ts
├── payments
│   ├── payments
│   │   ├── payments.service.spec.ts
│   │   └── payments.service.ts
│   ├── payments.controller.spec.ts
│   ├── payments.controller.ts
│   └── payments.module.ts
├── s3
│   ├── downloadFile.ts
│   ├── listFiles.ts
│   ├── permissions.ts
│   ├── signedUrl.ts
│   └── uploadFile.ts
├── shared
│   ├── prisma.ts
│   ├── s3Config.ts
│   └── stripeClient.ts
├── user
│   ├── user.controller.spec.ts
│   ├── user.controller.ts
│   ├── user.guard.spec.ts
│   ├── user.guard.ts
│   ├── user.module.ts
│   └── user.service.ts
├── utils
│   ├── assingCode.ts
│   ├── filterIncidents.ts
│   ├── forgotPassword.ts
│   ├── generateCode.ts
│   ├── generatePDF.ts
│   ├── getFileUrl.ts
│   ├── getuserEmail.ts
│   ├── getUserID.ts
│   ├── hash
│   │   ├── hashPassword.ts
│   │   └── verifyPassword.ts
│   ├── refreshToken.ts
│   ├── savePayment.ts
│   ├── saveProduct.ts
│   ├── types
│   │   ├── budgetData.ts
│   │   ├── contractType.ts
│   │   ├── incidentStatus.ts
│   │   ├── itemType.ts
│   │   ├── machineType.ts
│   │   ├── paymentStatus.ts
│   │   └── userType.ts
│   ├── validateCode.ts
│   └── validateFile.ts
└── worker
    ├── worker.controller.spec.ts
    ├── worker.controller.ts
    ├── worker.guard.spec.ts
    ├── worker.guard.ts
    ├── worker.module.ts
    └── worker.services.ts
  ```
## Módulos principales

### Admin
El módulo de admin cuenta con funcionalidades para gestionar empresas (crearlas, modificarlas, suspenderlas y activarlas) y con un panel de estadísticas en el que se muestran los datos de incidencias activas, clientes activos y compañías activas.

### Compañías
El módulo de compañías cuenta con funcionalidades para gestionar trabajadores (crearlos, editarlos, eliminarlos, asignarles guardias y asignarles incidencias).
En la parte de clientes, permite crear clientes asociados a la empresa y listarlos.
También incluye el módulo de creación de presupuestos para clientes, generando un PDF desde el propio servidor con Puppeteer.
Además, en el módulo de maquinaria, permite crear maquinaria asignada al cliente, modificar sus datos y su última inspección.

### Clientes
El módulo de clientes cuenta con funcionalidades para crear incidencias, ver las incidencias que tiene creadas, consultar la información de la maquinaria instalada y visualizar los presupuestos asignados, con posibilidad de contratar una empresa de su zona.

### Trabajadores
El módulo de trabajadores cuenta con funcionalidades para consultar las guardias asignadas, visualizar las incidencias asignadas y cambiar su estado.

### Mailing
El módulo de mailing permite la gestión del envío de correos a los usuarios suscritos a la newsletter y el envío de correos con actualizaciones de incidencias creadas por el cliente, información de pagos recibidos, guardias asignadas a trabajadores, trabajadores asignados a una incidencia, creación de presupuestos, alta y registro de usuarios, compañías y trabajadores.

### Payments
El módulo de payments permite la gestión de los pagos mediante Stripe, gestionando tanto las suscripciones como los pagos entre el cliente y la empresa, recibiendo una comisión del 10% por gestión.

### Ficheros
El módulo de ficheros o S3 permite la gestión de subida, descarga y listado de archivos en un bucket de Cloudflare.



## Tecnologías usadas


- **Backend:** NestJS
- **Base de datos:** Prisma ORM (PostgreSQL)
- **Sistema de pagos:** Stripe
- **Almacenamiento de archivos:** Cloudflare R2

---

Coded by manudev · [manuelguiradobaeza.com](https://manuelguiradobaeza.com)