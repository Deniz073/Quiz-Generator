import type { Chapter } from '../types'

export const chapter09: Chapter = {
  id: '9-governance-and-compliance',
  number: 9,
  title: 'Azure governance and compliance',
  questions: [
    {
      question:
        'What did Azure Blueprints let you do with an environment or subscription?',
      options: [
        'Monitor its performance and send alerts when thresholds are exceeded',
        'Estimate the cost of moving it from on-premises to Azure',
        'Define a repeatable set of resources, policies and role assignments to standardize deployments',
        'Block users from deleting resources inside it',
      ],
      correctIndex: 2,
      explanation:
        'A blueprint packages repeatable settings and policies so a team can quickly set up a compliant environment, for example a new test environment. Preventing deletion is the job of resource locks, not blueprints.',
    },
    {
      question:
        'Azure Blueprints has been deprecated. Which Azure features does Microsoft recommend as its replacement for standardizing environment deployments?',
      options: [
        'Azure Advisor and Azure Monitor',
        'Azure Arc and Azure Cloud Shell',
        'Azure Cost Management and the TCO calculator',
        'Template Specs and Deployment Stacks',
      ],
      correctIndex: 3,
      explanation:
        'Microsoft points Blueprints users to Template Specs (versioned, shareable ARM/Bicep templates) combined with Deployment Stacks (managing resources as a unit), alongside Azure Policy. The other options are management and monitoring tools without deployment definitions.',
    },
    {
      question: 'Which of the following is a type of Azure resource lock?',
      options: ['WriteOnly', 'Contributor', 'ReadOnly', 'Disabled'],
      correctIndex: 2,
      explanation:
        'Azure has two lock levels: Delete (called CanNotDelete in the API, CLI and PowerShell) and ReadOnly. Contributor is an RBAC role, not a lock.',
    },
    {
      question:
        'A production storage account must stay editable by authorized administrators, but nobody should be able to delete it by accident. Which lock should be applied?',
      options: [
        'Delete (CanNotDelete) lock',
        'ReadOnly lock',
        'A tag named Protected = true',
        'Both a ReadOnly and a Delete lock',
      ],
      correctIndex: 0,
      explanation:
        'A Delete lock still allows authorized users to read and modify the resource but blocks deletion. A ReadOnly lock would also prevent changes, which goes further than required.',
    },
    {
      question:
        'An operations team wants to make sure a critical virtual network configuration cannot be modified or deleted, even by authorized users, until the lock is removed. What should they use?',
      options: [
        'A Delete lock',
        'A ReadOnly lock',
        'Azure Advisor',
        'A resource group tag',
      ],
      correctIndex: 1,
      explanation:
        'With a ReadOnly lock, authorized users can only read the resource: no changes and no deletion. A Delete lock still allows modifications.',
    },
    {
      question:
        'A compliance officer needs Microsoft audit reports and information on how Microsoft protects cloud services and customer data. Where should they look?',
      options: [
        'Azure Service Health',
        'Azure Service Trust Portal',
        'Azure Cost Management',
        'Azure Resource Manager',
      ],
      correctIndex: 1,
      explanation:
        'The Service Trust Portal contains information about the controls and processes Microsoft uses to protect its cloud services and the customer data in them. Service Health only reports on the availability of Azure services.',
    },
    {
      question:
        'In the Service Trust Portal, you want to save a compliance document and be notified whenever Microsoft updates it. Which page offers this?',
      options: [
        'Trust Documents',
        'Industries & Regions',
        'My Library',
        'Service Trust Portal home page',
      ],
      correctIndex: 2,
      explanation:
        'My Library lets you save or pin documents and configure notifications for updates. Trust Documents and Industries & Regions are where you find the documents, not where you track them.',
    },
    {
      question:
        'Which two statements about Azure resource locks are correct? Select two.',
      options: [
        'A Delete (CanNotDelete) lock prevents authorized users from modifying the resource',
        'Locks can be applied at the subscription, resource group or resource level',
        "A ReadOnly lock still allows authorized users to modify the resource's configuration",
        'A lock applied to a resource group is inherited by the resources inside it',
      ],
      correctIndexes: [1, 3],
      explanation:
        'Locks can be set on a subscription, resource group or resource, and child resources inherit the lock of their parent. A Delete lock still allows modification, while a ReadOnly lock blocks both modification and deletion.',
    },
    {
      question:
        'Which two statements about Azure Policy are correct? Select two.',
      options: [
        'It grants users permission to perform actions on Azure resources',
        'It can enforce rules, for example allowing resources to be deployed only in approved regions',
        "It evaluates existing resources for compliance with your organization's standards",
        'It estimates the cost of a planned deployment',
      ],
      correctIndexes: [1, 2],
      explanation:
        'Azure Policy enforces organizational standards and assesses compliance of resources at scale. Granting permissions is the job of Azure RBAC, and cost estimates come from the Pricing calculator.',
    },
  ],
}
