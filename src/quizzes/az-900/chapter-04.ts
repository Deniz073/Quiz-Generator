import type { Chapter } from '../types'

export const chapter04: Chapter = {
  id: '4-core-architectural-components',
  number: 4,
  title: 'Core Azure architectural components',
  questions: [
    {
      question: 'What is an Azure region?',
      options: [
        'A single physical datacenter building owned by Microsoft',
        'A geographic area containing one or more datacenters connected by a low-latency network',
        'A logical container that groups resources for billing purposes',
        'A set of two paired datacenters at least 300 miles apart',
      ],
      correctIndex: 1,
      explanation:
        'A region is a geographic area with at least one, and often several, datacenters that are close together and linked by a low-latency network. A region pair is a different concept: two regions linked for resiliency.',
    },
    {
      question: 'Which description best matches an Azure availability zone?',
      options: [
        'A group of regions within the same country that share one billing account',
        'A virtual boundary that separates resources inside a single resource group',
        'A physically separate location within a region, with independent power, cooling, and networking',
        'A secondary region where Azure replicates your data after a disaster',
      ],
      correctIndex: 2,
      explanation:
        'An availability zone is made up of one or more datacenters with their own power, cooling, and networking, and acts as an isolation boundary: if one zone fails, the others keep running. A secondary region is the role of a region pair, not a zone.',
    },
    {
      question:
        'An Azure service is described as "zone-redundant". What does this mean?',
      options: [
        'The platform automatically replicates the service or data across multiple availability zones',
        'You must pin the resource to one specific availability zone yourself',
        'The service is only available in regions that have no availability zones',
        'The service stays available even if an entire region fails, without any replication',
      ],
      correctIndex: 0,
      explanation:
        'Zone-redundant services are replicated automatically by the platform across zones. With zonal services you choose the zone yourself, and surviving a region-wide outage requires non-regional services or a region pair.',
    },
    {
      question:
        'A company wants to deploy a virtual machine into availability zone 2 specifically, so it runs close to another resource in that zone. Which type of zone-supporting service is this?',
      options: [
        'Zone-redundant service',
        'Non-regional service',
        'Geo-redundant service',
        'Zonal service',
      ],
      correctIndex: 3,
      explanation:
        'With zonal services you pin a resource to a specific zone of your choice. Zone-redundant services replicate across zones automatically, so you do not select one.',
    },
    {
      question:
        'Why does Azure pair most regions with another region in the same geography, typically at least 300 miles away?',
      options: [
        'To lower latency between the two regions to a minimum',
        'To reduce the chance that one event, such as a natural disaster or power outage, affects both regions',
        'To allow both regions to share the same availability zones',
        'To let customers choose a cheaper price tier for the second region',
      ],
      correctIndex: 1,
      explanation:
        'The distance between paired regions lowers the likelihood that natural disasters, civil unrest, power failures, or network outages hit both at once. The large distance actually increases latency, so low latency is not the goal.',
    },
    {
      question: 'Which is a benefit of Azure region pairs?',
      options: [
        'Resources are automatically moved to the paired region every month',
        'Data is replicated outside the geography to improve performance',
        'Planned Azure updates are rolled out to paired regions one at a time to limit downtime',
        'Both regions of a pair are always restored at the same moment after an outage',
      ],
      correctIndex: 2,
      explanation:
        'Planned updates are applied to paired regions sequentially, which reduces downtime and the risk of unavailable applications. During a broad outage, one region of each pair is prioritized for recovery, not both. Data also stays within the same geography for residency and tax reasons.',
    },
    {
      question:
        'You delete an Azure resource group. What happens to the resources inside it?',
      options: [
        'All resources in the group are deleted as well',
        'The resources are moved to the default resource group of the subscription',
        'The resources remain but lose their access control assignments',
        'Only the resources that were created after the group are deleted',
      ],
      correctIndex: 0,
      explanation:
        'Deleting a resource group deletes every resource it contains, which is why resource groups are useful for lifecycle management. Resources are not moved elsewhere automatically.',
    },
    {
      question:
        'Which statement about Azure resources and resource groups is correct?',
      options: [
        'A resource can belong to multiple resource groups at the same time',
        'Resource groups can be nested inside other resource groups',
        'A resource can be created without a resource group if it has a subscription',
        'A resource group can contain many resources, but a resource belongs to only one resource group at a time',
      ],
      correctIndex: 3,
      explanation:
        'Every resource must be in exactly one resource group, although you can move it to another one. Resource groups cannot be nested. Management groups are the construct that can be nested.',
    },
    {
      question:
        'Which two kinds of boundaries can an Azure subscription define?',
      options: [
        'Network boundary and region boundary',
        'Resource boundary and tenant boundary',
        'Billing boundary and access control boundary',
        'Compliance boundary and availability boundary',
      ],
      correctIndex: 2,
      explanation:
        'A subscription is a unit of management, billing, and scale: it determines how an account is billed and is the level at which access control policies are applied. The other pairings are not subscription boundary types.',
    },
    {
      question:
        'A company wants separate Azure invoices for its Marketing and HR departments, and wants to give each department its own access policies. What is the most appropriate approach?',
      options: [
        'Create one resource group per department in a single subscription',
        'Create a separate subscription for each department',
        'Create one management group and deploy both departments into it',
        'Create a separate region for each department',
      ],
      correctIndex: 1,
      explanation:
        'Subscriptions are the billing and access control boundary, so separate subscriptions give separate invoices and access policies. Resource groups do not split billing into separate invoices, and a management group does not produce invoices at all.',
    },
    {
      question:
        'An organization has dozens of Azure subscriptions and wants to apply the same access and policy rules to all of them without configuring each one separately. What should it use?',
      options: [
        'Management groups',
        'Resource groups',
        'Availability sets',
        'Region pairs',
      ],
      correctIndex: 0,
      explanation:
        'Management groups sit above subscriptions and let you apply governance conditions that are inherited by all subscriptions inside them. Unlike resource groups, management groups can be nested.',
    },
    {
      question:
        'Which order shows the Azure management hierarchy from the highest to the lowest level?',
      options: [
        'Subscriptions, management groups, resources, resource groups',
        'Resource groups, subscriptions, management groups, resources',
        'Management groups, subscriptions, resource groups, resources',
        'Management groups, resource groups, subscriptions, resources',
      ],
      correctIndex: 2,
      explanation:
        'Management groups contain subscriptions, subscriptions contain resource groups, and resource groups contain resources. Governance applied at a higher level is inherited by the levels below it.',
    },
    {
      question:
        'Azure services that support availability zones fall into which three categories? Select three.',
      options: [
        'Zonal services',
        'Geo-paired services',
        'Zone-redundant services',
        'Subscription-redundant services',
        'Non-regional services',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'Zonal services are pinned to a zone you choose, zone-redundant services are replicated across zones automatically, and non-regional services are always available from Azure geographies and resilient to zone-wide and region-wide outages. Pairing applies to regions, not to zone support.',
    },
    {
      question:
        'Which two statements about Azure management groups are correct? Select two.',
      options: [
        'A subscription can belong to several management groups at the same time',
        'Management groups can be nested',
        'Policies and access controls applied to a management group are inherited by all subscriptions in it',
        'Management groups can be created inside a resource group',
      ],
      correctIndexes: [1, 2],
      explanation:
        'Management groups can be nested, unlike resource groups, and governance conditions applied to them flow down to every subscription inside. A subscription has exactly one parent management group, and management groups sit above subscriptions, so they are never created inside a resource group.',
    },
  ],
}
