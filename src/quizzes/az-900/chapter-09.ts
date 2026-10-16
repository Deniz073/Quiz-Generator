import type { Chapter } from '../types'

export const chapter09: Chapter = {
  id: '9-governance-and-compliance',
  number: 9,
  title: 'Azure governance and compliance',
  questions: [
    {
      id: '9-01',
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
      id: '9-02',
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
      id: '9-03',
      question: 'Which of the following is a type of Azure resource lock?',
      options: ['WriteOnly', 'Contributor', 'ReadOnly', 'Disabled'],
      correctIndex: 2,
      explanation:
        'Azure has two lock levels: Delete (called CanNotDelete in the API, CLI and PowerShell) and ReadOnly. Contributor is an RBAC role, not a lock.',
    },
    {
      id: '9-04',
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
      id: '9-05',
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
      id: '9-06',
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
      id: '9-07',
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
      id: '9-08',
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
      id: '9-09',
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
    {
      id: '9-10',
      question:
        'A company wants to discover and classify sensitive data across its on-premises, multicloud and SaaS data sources, and see how data moves between systems (data lineage). Which service should it use?',
      options: [
        'Azure Policy',
        'Microsoft Purview',
        'Azure Advisor',
        'Microsoft Entra ID',
      ],
      correctIndex: 1,
      explanation:
        'Microsoft Purview is a family of data governance, risk and compliance solutions: it maps your data, classifies sensitive information and tracks lineage. Azure Policy enforces rules on the configuration of Azure resources, not on the data inside them.',
    },
    {
      id: '9-11',
      question:
        'An organization has fifteen Azure Policy definitions that it wants to assign together as one unit, to track compliance with a standard. What should it use?',
      options: [
        'A resource lock',
        'A management group',
        'A policy initiative',
        'An Azure RBAC role',
      ],
      correctIndex: 2,
      explanation:
        'A policy initiative (also called a policy set) groups related policy definitions so they are assigned and tracked as one. A management group is a scope you can assign the initiative to, not a way to group policies.',
    },
    {
      id: '9-12',
      question:
        'A resource is deployed without a required tag. Besides marking it as noncompliant, what can Azure Policy do?',
      options: [
        'Delete the resource and charge the cost to the user who deployed it',
        "Revoke the deploying user's RBAC role",
        'Move the resource to another subscription',
        'Remediate it automatically, for example by adding the missing tag',
      ],
      correctIndex: 3,
      explanation:
        'Azure Policy can remediate noncompliant resources, for example by adding a missing tag or inheriting it from the resource group. It does not change who has access; that is the job of Azure RBAC.',
    },
    {
      id: '9-13',
      question:
        'A user with the Owner role tries to delete a resource that has a Delete lock. What happens?',
      options: [
        'The deletion succeeds, because the Owner role bypasses locks',
        'The deletion is blocked; the lock must be removed first',
        'The resource is moved to a recycle bin for 30 days',
        'The deletion succeeds after a 24-hour delay',
      ],
      correctIndex: 1,
      explanation:
        'Locks apply to all users and roles, including Owner. To delete the resource, someone with permission to manage locks must first remove the lock, which is an extra deliberate step that prevents accidents.',
    },
  ],
}
