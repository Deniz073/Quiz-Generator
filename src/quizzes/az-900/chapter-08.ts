import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: '8-cost-management',
  number: 8,
  title: 'Azure cost management',
  questions: [
    {
      id: '8-01',
      question:
        'What is the main financial shift when a company moves its infrastructure from on-premises to Azure?',
      options: [
        'Operational expenses (OpEx) are replaced by capital expenses (CapEx)',
        'Capital expenses (CapEx) for building infrastructure become operational expenses (OpEx) for renting it',
        'All infrastructure costs become fixed monthly fees',
        'Maintenance costs are eliminated completely',
      ],
      correctIndex: 1,
      explanation:
        'In the cloud you rent infrastructure when you need it, so up-front CapEx turns into ongoing OpEx. Maintenance of the underlying hardware moves to Microsoft, but you still pay for and must manage your own resources.',
    },
    {
      id: '8-02',
      question:
        'You deploy the same virtual machine size in two different Azure regions and notice the price differs. Which cost factor explains this?',
      options: [
        'Maintenance, because one region requires more upkeep',
        'The subscription type, because each region needs its own',
        'Resource type and geography, because settings and region both affect the price',
        'Azure Marketplace, because regional offers are billed separately',
      ],
      correctIndex: 2,
      explanation:
        'The resource type, its settings and the Azure region it runs in all influence what it costs. Pricing varies per region, so choosing a region is also a cost decision.',
    },
    {
      id: '8-03',
      question:
        'A company pays for Azure compute only for the hours its virtual machines actually run in a billing cycle. Which cost factor does this describe?',
      options: [
        'Consumption (pay-as-you-go usage)',
        'Geography',
        'Resource type',
        'Azure Marketplace',
      ],
      correctIndex: 0,
      explanation:
        'Consumption-based pricing means you pay for the resources you use during a billing cycle: the more compute you use, the more you pay. Resource type only describes what you deploy, not how long or how much you use it.',
    },
    {
      id: '8-04',
      question:
        'A company wants to compare the cost of running its current on-premises datacenter with the cost of running the same workloads in Azure. Which tool should it use?',
      options: [
        'Azure Cost Management',
        'Azure Pricing calculator',
        'Azure Advisor',
        'Total Cost of Ownership (TCO) calculator',
      ],
      correctIndex: 3,
      explanation:
        'The TCO calculator takes your on-premises configuration as input and calculates the difference with an Azure deployment. The Pricing calculator only estimates the cost of Azure services you plan to use, without an on-premises comparison.',
    },
    {
      id: '8-05',
      question:
        'An architect wants to estimate the monthly cost of a new solution made up of Azure virtual machines and a SQL database before deploying anything. Which tool fits best?',
      options: [
        'Pricing calculator',
        'TCO calculator',
        'Azure Cost Management',
        'Azure Service Health',
      ],
      correctIndex: 0,
      explanation:
        'The Pricing calculator estimates the cost of the specific Azure services and configurations you select. Azure Cost Management analyzes costs of resources that already exist, so it cannot price a planned solution.',
    },
    {
      id: '8-06',
      question:
        'Which Azure tool gives an overview of all your resources and their usage, lets you analyze costs at different levels of detail, and can warn you when you approach your budget?',
      options: [
        'Azure Monitor',
        'Azure Cost Management',
        'TCO calculator',
        'Azure Resource Manager',
      ],
      correctIndex: 1,
      explanation:
        'Azure Cost Management provides cost analysis plus budgets and alerts for when spending nears a limit. Azure Monitor tracks telemetry and performance, not spending.',
    },
    {
      id: '8-07',
      question:
        'The finance team wants to see the Azure costs of all resources that belong to the Marketing department, even though those resources are spread over several resource groups. What should be applied to the resources?',
      options: [
        'A ReadOnly resource lock',
        'A tag such as Department = Marketing',
        'A separate Azure region',
        'An Azure Advisor recommendation',
      ],
      correctIndex: 1,
      explanation:
        'Tags are name-value pairs that organize resources logically, and costs can be viewed for all resources sharing the same tag. A resource lock only prevents changes or deletion and says nothing about billing.',
    },
    {
      id: '8-08',
      question:
        'A team buys a third-party firewall appliance and a monitoring solution that are offered as ready-to-deploy Azure solutions from external vendors. Where do these purchases come from?',
      options: [
        'Azure Marketplace',
        'Azure Arc',
        'Azure Service Trust Portal',
        'Azure Blueprints',
      ],
      correctIndex: 0,
      explanation:
        'Azure Marketplace lets you buy Azure-based solutions and services from third-party vendors, and these purchases add to your Azure costs. Azure Arc is a management tool for hybrid and multicloud resources, not a store.',
    },
    {
      id: '8-09',
      question:
        'Which two tools can you use to estimate or compare costs before anything has been deployed to Azure? Select two.',
      options: [
        'Azure Pricing calculator',
        'Microsoft Cost Management (formerly Azure Cost Management)',
        'Azure Total Cost of Ownership (TCO) calculator',
        'Azure Advisor',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Pricing calculator estimates the cost of planned Azure services, and the TCO calculator compares on-premises costs with Azure costs. Cost Management analyzes actual spending on deployed resources, and Advisor gives recommendations for existing resources.',
    },
    {
      id: '8-10',
      question:
        'Which four factors can influence the cost of using Azure resources? Select four.',
      options: [
        'The Azure region in which the resource runs',
        'The number of tags applied to the resource',
        'The type and size of the resource',
        'The number of Azure Advisor recommendations for the resource',
        'The amount of the resource that is consumed',
        'Outbound data transfers',
      ],
      correctIndexes: [0, 2, 4, 5],
      explanation:
        'Resource type and settings, consumption, geography (region) and outbound data transfers (billed by type and destination) all affect the price. Tags and Advisor recommendations carry no cost themselves, although tags can help you analyze costs.',
    },
    {
      id: '8-11',
      question:
        'Which two features are available by using Azure Cost Management + Billing? Select two.',
      options: [
        'Create and manage budgets',
        'Estimate the total cost of ownership before resources are deployed',
        'Generate historical reports and forecast future usage and expenditures',
        'Provide discounted prices when you pay in advance',
      ],
      correctIndexes: [0, 2],
      explanation:
        'Cost Management lets you set budgets and use historical data to report on and forecast spending. Estimating TCO before deployment is the TCO calculator, and prepayment discounts come from offers such as reservations.',
    },
    {
      id: '8-12',
      question:
        'An Azure virtual machine is only used between 9:00 and 17:00 each day. How can you minimize costs while preserving its disks and data?',
      options: [
        'Delete the virtual machine when it is not needed',
        'Resize the virtual machine to a smaller size',
        'Deallocate the virtual machine when it is not needed',
        'Implement Privileged Identity Management',
      ],
      correctIndex: 2,
      explanation:
        'A deallocated VM stops incurring compute charges while its disks and data are kept (storage is still billed), and you start it again when needed. Deleting the VM removes it, and resizing still bills compute around the clock.',
    },
    {
      id: '8-13',
      question:
        'A company runs a set of virtual machines 24/7 with a steady workload that must not be interrupted for the next three years. Which purchase option gives the biggest discount?',
      options: [
        'Pay-as-you-go',
        'Azure Reservations with a one- or three-year term',
        'Azure Spot Virtual Machines',
        'An Azure free account',
      ],
      correctIndex: 1,
      explanation:
        'Reservations give a large discount in exchange for a one- or three-year commitment, which suits steady, always-on workloads. Spot VMs can be cheaper, but Azure can evict them at any moment, so they do not fit workloads that must not be interrupted.',
    },
    {
      id: '8-14',
      question:
        'A team runs batch jobs that can be stopped and restarted at any time without problems, and wants the lowest possible compute price. Which option fits best?',
      options: [
        'Azure Reservations with a three-year term',
        'Azure Dedicated Host',
        'Pay-as-you-go virtual machines',
        'Azure Spot Virtual Machines',
      ],
      correctIndex: 3,
      explanation:
        "Spot VMs use Azure's unused capacity at a deep discount, but Azure can evict them when it needs that capacity back. That is fine for interruptible work like batch jobs, while a reservation requires a long commitment that does not suit occasional jobs.",
    },
    {
      id: '8-15',
      question:
        'A company already owns Windows Server and SQL Server licenses with Software Assurance. How can it lower the cost of running these workloads in Azure?',
      options: [
        'Use Azure Hybrid Benefit to reuse its existing licenses',
        'Apply a ReadOnly lock to the virtual machines',
        'Move the virtual machines to a different management group',
        'Enable geo-redundant storage',
      ],
      correctIndex: 0,
      explanation:
        "Azure Hybrid Benefit lets you bring eligible on-premises Windows Server and SQL Server licenses to Azure, so you don't pay for those licenses again. Locks and management groups govern resources but don't change their price.",
    },
    {
      id: '8-16',
      question: 'How is network data transfer generally billed in Azure?',
      options: [
        'Both inbound and outbound data transfer are always free',
        'Inbound data is charged, while outbound data is free',
        'Inbound data (ingress) is generally free, while outbound data (egress) is charged',
        'Data transfer is only charged between resources in the same virtual network',
      ],
      correctIndex: 2,
      explanation:
        'Data going into Azure is generally free, but data leaving Azure, to the internet or between regions, is billed. That makes egress a cost factor alongside resource type, usage and region.',
    },
    {
      id: '8-17',
      question:
        'You set a monthly budget in Azure Cost Management, and spending passes 100% of it. What happens by default?',
      options: [
        'Azure deallocates all resources in the scope of the budget',
        'Azure deletes the most expensive resources first',
        'An alert is sent, but the resources keep running',
        'The subscription is converted to a free account',
      ],
      correctIndex: 2,
      explanation:
        'Budgets send alerts when thresholds are reached; they do not stop resources on their own. To act automatically, you can connect the budget to an action group that, for example, runs automation to shut down VMs.',
    },
    {
      id: '8-18',
      question:
        'A company has a steady compute spend but expects to change virtual machine sizes and regions over the next three years. Which purchase option gives a discount while keeping that flexibility?',
      options: [
        'Azure Reserved Virtual Machine Instances',
        'Azure Spot Virtual Machines',
        'Azure Hybrid Benefit',
        'An Azure savings plan for compute',
      ],
      correctIndex: 3,
      explanation:
        'A savings plan commits to a fixed hourly spend for one or three years and applies the discount across VM sizes and regions. A reservation gives its discount for a specific VM size and region, so it is less flexible.',
    },
  ],
}
