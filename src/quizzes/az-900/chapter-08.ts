import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: '8-cost-management',
  number: 8,
  title: 'Azure cost management',
  questions: [
    {
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
      question:
        'Which three factors can influence the cost of using Azure resources? Select three.',
      options: [
        'The Azure region in which the resource runs',
        'The number of tags applied to the resource',
        'The type and size of the resource',
        'The number of Azure Advisor recommendations for the resource',
        'The amount of the resource that is consumed',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'Resource type and settings, consumption and geography (region) all affect the price. Tags and Advisor recommendations carry no cost themselves, although tags can help you analyze costs.',
    },
  ],
}
