import type { Chapter } from '../types'

export const chapter01: Chapter = {
  id: '1-cloud-computing',
  number: 1,
  title: 'Cloud computing',
  questions: [
    {
      id: '1-01',
      question: 'Which statement best describes cloud computing?',
      options: [
        'Delivering IT services such as virtual machines, storage, databases and networking over the internet',
        "Running all of an organization's servers in a single on-premises datacenter",
        'Purchasing physical hardware from a vendor and leasing it to other companies',
        'Replacing all employee devices with thin clients managed by a vendor',
      ],
      correctIndex: 0,
      explanation:
        'Cloud computing is the delivery of IT services (compute, storage, databases, networking, and also IoT, machine learning and AI) over the internet.',
    },
    {
      id: '1-02',
      question:
        'Under the shared responsibility model, which responsibility always stays with the customer, regardless of the cloud service type?',
      options: [
        'Physical security of the datacenter',
        'Power and cooling of the hardware',
        'Network connectivity of the datacenter',
        'The data and information stored in the cloud, including access to it',
      ],
      correctIndex: 3,
      explanation:
        'The customer is always responsible for their own data and who can access it. Physical security, power, cooling and datacenter connectivity belong to the cloud provider.',
    },
    {
      id: '1-03',
      question:
        'A company runs a database on an Azure virtual machine. Who is responsible for applying updates and patches to the database software?',
      options: [
        'Microsoft, because the VM runs in an Azure datacenter',
        'The company, because the database runs on infrastructure it manages itself',
        'Both parties equally, as defined by the Azure SLA',
        'Nobody, because Azure patches all software automatically',
      ],
      correctIndex: 1,
      explanation:
        'When you run a database on a VM, you manage the software on it, including updates and patches. Microsoft only handles the underlying physical infrastructure.',
    },
    {
      id: '1-04',
      question:
        'Which of the following is the responsibility of the cloud provider in every cloud service type?',
      options: [
        'Patching the guest operating system',
        'Physical security, power, cooling and network connectivity',
        'Configuring user access to the stored data',
        'Maintaining the data inside a customer database',
      ],
      correctIndex: 1,
      explanation:
        "The physical layer is always the provider's job. Guest OS patching depends on the service type (customer in IaaS), while data and access are always the customer's.",
    },
    {
      id: '1-05',
      question: 'Which cloud model is used by a single organization only?',
      options: ['Public cloud', 'Multi-cloud', 'Private cloud', 'Hybrid cloud'],
      correctIndex: 2,
      explanation:
        'A private cloud is used by a single entity and can be hosted on-premises or in a dedicated off-site datacenter. It gives high control but at higher cost and with fewer benefits than a public cloud.',
    },
    {
      id: '1-06',
      question:
        'A company keeps its core systems in its own datacenter but wants to temporarily use extra capacity from a public cloud during seasonal peaks. Which cloud model fits this scenario?',
      options: [
        'Private cloud',
        'Hybrid cloud',
        'Multi-cloud',
        'Community cloud',
      ],
      correctIndex: 1,
      explanation:
        'A hybrid cloud combines private and public cloud in one connected environment, so the private side can scale out into the public cloud during peaks. Multi-cloud would mean using multiple public cloud providers.',
    },
    {
      id: '1-07',
      question: 'What characterizes a multi-cloud environment?',
      options: [
        'It combines one private cloud with one public cloud',
        'It uses several regions of a single public cloud provider',
        'It is built and owned by a single organization in its own datacenter',
        'It uses two or more public cloud providers, with resources and security managed across all of them',
      ],
      correctIndex: 3,
      explanation:
        'Multi-cloud means working with two or more public cloud providers, for example to use different applications per provider or while migrating between providers. Private plus public is hybrid.',
    },
    {
      id: '1-08',
      question:
        'Which Azure service helps you manage resources across on-premises, multi-cloud and other cloud environments from a single place?',
      options: [
        'Azure Arc',
        'Azure Monitor',
        'Azure VMware Solution',
        'Azure Advisor',
      ],
      correctIndex: 0,
      explanation:
        'Azure Arc extends Azure management to resources running outside Azure, such as on-premises and other clouds. Azure VMware Solution is about migrating VMware workloads, not general management.',
    },
    {
      id: '1-09',
      question:
        'A company runs VMware workloads in its own private cloud and wants to migrate them to Azure while keeping the same tooling. Which service is intended for this?',
      options: [
        'Azure Arc',
        'Azure Lighthouse',
        'Azure Virtual Desktop',
        'Azure VMware Solution',
      ],
      correctIndex: 3,
      explanation:
        'Azure VMware Solution lets you move VMware workloads from a private cloud to a public or hybrid cloud with seamless integration and scalability. Azure Arc manages resources but does not host the VMware workloads.',
    },
    {
      id: '1-10',
      question:
        'Buying physical servers for a datacenter is a typical example of which type of expenditure?',
      options: [
        'Operational expenditure (OpEx)',
        'Capital expenditure (CapEx)',
        'Consumption-based expenditure',
        'Subscription expenditure',
      ],
      correctIndex: 1,
      explanation:
        'CapEx is typically a one-time, upfront spend on tangible resources such as datacenter hardware. OpEx is the cost of services or products over time, such as using Azure VMs.',
    },
    {
      id: '1-11',
      question:
        'Which of the following is an advantage of the consumption-based model used by cloud providers?',
      options: [
        'A large upfront investment guarantees lower prices later',
        'You must buy capacity for your expected peak load in advance',
        'You pay only for the resources you use and can stop paying when they are no longer needed',
        'Costs are fixed regardless of how much you use',
      ],
      correctIndex: 2,
      explanation:
        'The consumption-based model has no upfront costs and no need to buy and manage expensive infrastructure that may be underused. You buy resources when needed and stop paying when you release them.',
    },
    {
      id: '1-12',
      question:
        'Which three of the following environments make use of public cloud services? Select three.',
      options: [
        'A hybrid cloud that combines a private cloud with a public cloud',
        "A private cloud hosted in the organization's own datacenter",
        'A multi-cloud environment that uses two or more public cloud providers',
        "A solution that runs entirely on a public cloud provider's platform",
        'A traditional on-premises datacenter without any cloud services',
      ],
      correctIndexes: [0, 2, 3],
      explanation:
        'Hybrid cloud, multi-cloud and a pure public cloud solution all consume public cloud resources. A private cloud is used by a single organization only, and a datacenter without cloud services is not cloud computing at all.',
    },
    {
      id: '1-13',
      question:
        'Which two of the following are examples of operational expenditure (OpEx)? Select two.',
      options: [
        'Buying physical servers for an on-premises datacenter',
        'Paying per hour for Azure virtual machines',
        'Purchasing network switches and racks for a datacenter',
        'Paying monthly for the Azure Storage capacity you consume',
      ],
      correctIndexes: [1, 3],
      explanation:
        'OpEx is the cost of services or products paid for over time, such as consumption-based Azure VMs and storage. Servers, switches and racks are tangible, upfront purchases, which makes them capital expenditure (CapEx).',
    },
  ],
}
