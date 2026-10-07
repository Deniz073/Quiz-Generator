import type { Chapter } from '../types'

export const chapter03: Chapter = {
  id: '3-cloud-service-types',
  number: 3,
  title: 'Cloud service types',
  questions: [
    {
      question:
        'Which cloud service type is the most flexible and gives you the most control over your resources?',
      options: [
        'Software as a service (SaaS)',
        'Platform as a service (PaaS)',
        'Function as a service (FaaS)',
        'Infrastructure as a service (IaaS)',
      ],
      correctIndex: 3,
      explanation:
        'IaaS offers maximum control, but it also places most of the responsibility on the customer. SaaS is the least flexible of the three.',
    },
    {
      question:
        'In an IaaS model, which of the following is the responsibility of the customer rather than the cloud provider?',
      options: [
        'Physical security of the datacenter',
        'Maintaining the underlying hardware',
        'Installing, configuring and maintaining the operating system',
        'Network connectivity of the datacenter',
      ],
      correctIndex: 2,
      explanation:
        'In IaaS the provider handles hardware, datacenter connectivity and physical security, while the customer manages the OS and network, database and storage configuration.',
    },
    {
      question:
        'A company wants to move its existing on-premises servers to the cloud with as few changes as possible, recreating a setup similar to its own datacenter. Which service type and approach fit best?',
      options: [
        'SaaS, replacing the servers with a hosted application',
        'PaaS, rewriting the applications for a managed framework',
        'IaaS, using a lift-and-shift migration',
        'SaaS, using a multi-tenant email service',
      ],
      correctIndex: 2,
      explanation:
        'Lift-and-shift migrates what runs on-premises to IaaS infrastructure that resembles your datacenter. PaaS would typically require adapting the applications.',
    },
    {
      question:
        'A team needs development and test environments that can be started and shut down quickly while keeping full control over the configuration. Which service type suits this best?',
      options: ['SaaS', 'IaaS', 'Private cloud only', 'Azure Arc'],
      correctIndex: 1,
      explanation:
        'IaaS lets you quickly replicate, start and stop test and development environments while keeping full control. SaaS provides a finished application and no environment control.',
    },
    {
      question:
        'How does the shared responsibility model divide responsibility in a PaaS solution?',
      options: [
        'Almost everything is the responsibility of the customer',
        'Responsibility is shared between the cloud provider and the customer, in between IaaS and SaaS',
        "Almost everything is the responsibility of the cloud provider, including the customer's data",
        'The customer is responsible for the physical infrastructure',
      ],
      correctIndex: 1,
      explanation:
        'PaaS is the middle ground: the provider manages infrastructure, operating systems and middleware, while the customer focuses on applications and data. Even in SaaS, the customer remains responsible for data and access.',
    },
    {
      question:
        'Developers want to build and customize a cloud application without managing operating systems or middleware, and benefit from built-in scalability and high availability. Which service type fits?',
      options: ['IaaS', 'SaaS', 'PaaS', 'On-premises hosting'],
      correctIndex: 2,
      explanation:
        'PaaS provides a development framework with built-in features such as scalability, high availability and multi-tenancy, so developers write less code. In IaaS they would have to manage the OS themselves.',
    },
    {
      question:
        'An organization wants to analyze and mine its data, find patterns and predict outcomes using tools delivered as a managed service. Which cloud service type is the typical scenario for this?',
      options: ['IaaS', 'SaaS', 'Private cloud', 'PaaS'],
      correctIndex: 3,
      explanation:
        'Analytics and business intelligence tools provided as a service are a typical PaaS scenario. The provider maintains the BI services that form the cloud solution.',
    },
    {
      question:
        "A company wants to use hosted email and messaging without managing servers or updating software. For SaaS, what remains the customer's responsibility?",
      options: [
        'Patching the application software',
        'The data and the access to the system',
        'Maintaining the operating system',
        'Providing the datacenter hardware',
      ],
      correctIndex: 1,
      explanation:
        'In SaaS the provider is responsible for everything including updates and patches. The customer always stays responsible for their data and access to it (plus their own devices, accounts and identities).',
    },
    {
      question:
        'Which three of the following are responsibilities of the cloud provider in an IaaS model? Select three.',
      options: [
        'Installing and patching the guest operating system',
        'Providing and maintaining the physical hardware',
        'Configuring the database and storage settings of the workload',
        'Network connectivity of the datacenter',
        'Physical security of the datacenter',
      ],
      correctIndexes: [1, 3, 4],
      explanation:
        'In IaaS the provider is responsible for hardware, network connectivity and physical security. The customer installs, configures and maintains the operating system and configures databases and storage, which is why IaaS gives the most control.',
    },
    {
      question:
        'Which two of the following Azure services are PaaS offerings? Select two.',
      options: [
        'Azure Virtual Machines',
        'Azure App Service',
        'Microsoft 365',
        'Azure SQL Database',
      ],
      correctIndexes: [1, 3],
      explanation:
        'App Service and Azure SQL Database are managed platforms: you deploy your app or data and Microsoft runs the operating system and infrastructure. Azure Virtual Machines is IaaS, and Microsoft 365 is SaaS.',
    },
  ],
}
