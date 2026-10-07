import type { Chapter } from '../types'

export const chapter02: Chapter = {
  id: '2-benefits-of-cloud-services',
  number: 2,
  title: 'Benefits of using cloud services',
  questions: [
    {
      id: '2-01',
      question: 'What is the goal of high availability in the cloud?',
      options: [
        'Keeping services accessible as much as possible, regardless of interruptions or events',
        'Reducing the cost of resources to the absolute minimum',
        'Encrypting all data at rest and in transit',
        'Automatically adding more CPU and RAM to a running VM',
      ],
      correctIndex: 0,
      explanation:
        'High availability is about maximizing the uptime of services despite disruptions. Adding CPU and RAM is vertical scaling, which is a different concept.',
    },
    {
      id: '2-02',
      question:
        'What does a service level agreement (SLA) for an Azure service define?',
      options: [
        'The maximum monthly price of the service',
        'The physical location of the datacenter hosting the service',
        'The guaranteed uptime of the service',
        'The number of support engineers assigned to your account',
      ],
      correctIndex: 2,
      explanation:
        'An SLA is an agreement on the guaranteed uptime of Azure services. It is defined per service, so it can differ from one service to another.',
    },
    {
      id: '2-03',
      question: 'Which statement about Azure SLAs is correct?',
      options: [
        'One SLA applies equally to every Azure service',
        'SLAs are defined per service and can therefore differ between services',
        'SLAs only apply to virtual machines',
        'SLAs guarantee that an Azure service will never fail',
      ],
      correctIndex: 1,
      explanation:
        'SLAs are agreed per service, so uptime guarantees vary. They express a guaranteed uptime percentage, not a promise of zero failures.',
    },
    {
      id: '2-04',
      question:
        'An online shop expects a sudden traffic spike during a sale and does not want to pay for unused capacity afterwards. Which cloud benefit addresses this?',
      options: [
        'Predictability',
        'Reliability',
        'Scalability',
        'Manageability',
      ],
      correctIndex: 2,
      explanation:
        'Scalability lets you adjust resources to demand, scaling up for peaks and back down afterwards so you do not overpay. Reliability is about recovering from failures.',
    },
    {
      id: '2-05',
      question:
        'An application on a running VM needs more processing power, so you give that same VM additional CPU cores and RAM. What is this called?',
      options: [
        'Horizontal scaling',
        'Geo-replication',
        'Vertical scaling',
        'Load balancing',
      ],
      correctIndex: 2,
      explanation:
        'Vertical scaling (scale up) adds CPU and RAM to an existing resource. Horizontal scaling would add more VM instances instead.',
    },
    {
      id: '2-06',
      question:
        'To handle more load, a team deploys a second and third VM next to the existing one instead of enlarging it. What is this called?',
      options: [
        'Horizontal scaling',
        'Vertical scaling',
        'Disaster recovery',
        'Resource tagging',
      ],
      correctIndex: 0,
      explanation:
        'Horizontal scaling (scale out) duplicates existing resources by adding more instances. Vertical scaling makes one instance larger.',
    },
    {
      id: '2-07',
      question:
        'Which cloud benefit is described as the ability of a system to recover from failures and keep functioning?',
      options: ['Reliability', 'Scalability', 'Predictability', 'Governance'],
      correctIndex: 0,
      explanation:
        "Reliability is a system's ability to recover from failures and continue to operate. Scalability is about matching resources to demand.",
    },
    {
      id: '2-08',
      question:
        'How does Azure help provide reliability if an entire datacenter region is irreparably damaged?',
      options: [
        'Customers must rebuild the lost resources manually from scratch',
        'Microsoft automatically scales the VMs in the damaged region up',
        'Resources can be replicated across multiple geographic regions, so another region can take over',
        'Azure automatically converts the customer to a private cloud',
      ],
      correctIndex: 2,
      explanation:
        'Azure supports duplicating your cloud resources across different geographic regions. If one region is lost, another region is still available to use.',
    },
    {
      id: '2-09',
      question:
        "A company wants to build a solution in Azure for which it can forecast both the system's performance and its costs with confidence. Which cloud benefit is this?",
      options: [
        'Predictability',
        'High availability',
        'Reliability',
        'Vertical scaling',
      ],
      correctIndex: 0,
      explanation:
        'Predictability in the cloud covers two sides: performance predictability and cost predictability. It lets you work in the cloud with confidence.',
    },
    {
      id: '2-10',
      question:
        'Which of the following is an example of management OF the cloud (as opposed to management IN the cloud)?',
      options: [
        'Using PowerShell to create a resource',
        'Using the Azure portal to inspect a VM',
        'Calling an API to change a configuration',
        'Automatically replacing a failed resource based on health monitoring',
      ],
      correctIndex: 3,
      explanation:
        'Management of the cloud covers automatic scaling, template-based deployment, health monitoring with automatic replacement, and alerts. The portal, CLI, APIs and PowerShell are ways of managing in the cloud.',
    },
    {
      id: '2-11',
      question:
        'A team wants to deploy identical resources repeatedly without manual configuration, to reduce human error. Which manageability capability supports this?',
      options: [
        'Deploying resources from templates',
        'Switching from CapEx to OpEx',
        'Changing the SLA of the service',
        'Moving to a private cloud',
      ],
      correctIndex: 0,
      explanation:
        'Deploying resources according to templates reduces or avoids manual configuration. The other options do not address repeatable, automated deployment.',
    },
    {
      id: '2-12',
      question:
        'Which of the following is a way to manage your Azure resources (management IN the cloud)?',
      options: [
        'Only through the physical datacenter console',
        'Via a web portal, a command-line interface (CLI), APIs or PowerShell',
        'Only by contacting Microsoft support',
        'Only through an on-premises management server',
      ],
      correctIndex: 1,
      explanation:
        'You can manage Azure through the web portal, a CLI, APIs and PowerShell. Microsoft does not require support requests or physical access for this.',
    },
    {
      id: '2-13',
      question:
        'Which two are benefits of scalability in the cloud? Select two.',
      options: [
        'A sudden traffic spike can be absorbed by quickly deploying extra resources',
        'The provider guarantees a fixed uptime percentage for each service',
        'Resources can be scaled down again, so you do not pay for unused capacity',
        'Resources are duplicated across geographic regions so another region can take over',
      ],
      correctIndexes: [0, 2],
      explanation:
        'Scalability means matching resources to demand: scale out or up for peaks and back down afterwards. A guaranteed uptime percentage is an SLA (high availability), and duplicating resources across regions is about reliability.',
    },
    {
      id: '2-14',
      question:
        'Which two of the following are examples of management OF the cloud (rather than management IN the cloud)? Select two.',
      options: [
        'Running Azure CLI commands from a terminal',
        'Automatically receiving alerts when a monitored value crosses a configured threshold',
        'Calling the Azure REST API to change a configuration',
        'Automatically scaling the deployment of resources based on demand',
      ],
      correctIndexes: [1, 3],
      explanation:
        'Management of the cloud covers automatic scaling, template-based deployment, health monitoring with automatic replacement, and automatic alerts. The CLI, PowerShell, APIs and the portal are ways of managing in the cloud.',
    },
  ],
}
