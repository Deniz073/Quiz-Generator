import type { Chapter } from '../types'

export const chapter05: Chapter = {
  id: '5-compute-and-networking',
  number: 5,
  title: 'Azure compute and networking services',
  questions: [
    {
      id: '5-01',
      question:
        'A team needs full control over the operating system and wants to install custom software and use custom hosting configurations. Which Azure service fits best?',
      options: [
        'Azure Functions',
        'Azure Virtual Machines',
        'Azure App Service',
        'Azure Container Instances',
      ],
      correctIndex: 1,
      explanation:
        'Azure Virtual Machines is an IaaS offering that gives you control over the OS and the software you run. Functions and App Service are managed platforms where you do not control the OS.',
    },
    {
      id: '5-02',
      question:
        'A company wants a cost-effective way to keep its critical applications running in Azure while its primary datacenter is down, and then remove the resources afterwards. Which Azure Virtual Machines use case is this?',
      options: [
        'Testing and development',
        'Extending the datacenter to the cloud',
        'Running applications with fluctuating demand',
        'Disaster recovery',
      ],
      correctIndex: 3,
      explanation:
        'VMs can be created in Azure to take over critical workloads when the primary datacenter fails and be deleted once it is restored. You only pay for what you use during that time.',
    },
    {
      id: '5-03',
      question: 'What does an Azure Virtual Machine Scale Set provide?',
      options: [
        'A group of identical, load-balanced VMs whose number can automatically grow or shrink based on demand or a schedule',
        'A group of VMs spread across update and fault domains, with no autoscaling',
        'A single large VM whose CPU and memory are increased automatically',
        'A dedicated physical server for a single customer',
      ],
      correctIndex: 0,
      explanation:
        'Scale sets let you centrally create and manage many identical VMs and autoscale them. Spreading VMs across update and fault domains describes an availability set.',
    },
    {
      id: '5-04',
      question:
        'In an Azure availability set, what does a fault domain represent?',
      options: [
        'A group of VMs that can all be rebooted at the same time during maintenance',
        'A group of VMs deployed in the same Azure region and subscription',
        'A group of VMs that share a common power source and network switch',
        'A group of VMs that share the same virtual network address space',
      ],
      correctIndex: 2,
      explanation:
        'A fault domain groups VMs on common power and networking hardware, so spreading VMs over fault domains protects against a single power or network failure. Rebooting together describes an update domain.',
    },
    {
      id: '5-05',
      question: 'What is the purpose of update domains in an availability set?',
      options: [
        'They store VM images so updates can be installed faster',
        'They ensure that only one group of VMs is rebooted at a time during planned maintenance',
        'They automatically add VMs when an update increases the load',
        'They protect the VMs against a power failure in the datacenter',
      ],
      correctIndex: 1,
      explanation:
        'VMs in an update domain are restarted together, but only one update domain is taken offline at a time, so the rest of your VMs keep running. Power and network protection come from fault domains.',
    },
    {
      id: '5-06',
      question:
        'Which service lets users access a cloud-hosted Windows desktop and applications from any location?',
      options: [
        'Azure Container Instances',
        'Azure App Service',
        'Azure Virtual Network',
        'Azure Virtual Desktop',
      ],
      correctIndex: 3,
      explanation:
        'Azure Virtual Desktop is a desktop and application virtualization service running in the cloud. It supports management through Microsoft Entra ID (formerly Azure AD) and security through MFA and RBAC.',
    },
    {
      id: '5-07',
      question:
        'A developer wants to run a containerized application in Azure without managing virtual machines or orchestrating anything. Which service should be used?',
      options: [
        'Azure Container Instances',
        'Azure Virtual Machine Scale Sets',
        'Azure Virtual Desktop',
        'Azure Availability Sets',
      ],
      correctIndex: 0,
      explanation:
        'With Azure Container Instances you upload your container and Azure runs it, without VM management. Scale sets still require you to manage VMs and their operating systems.',
    },
    {
      id: '5-08',
      question:
        'A company wants to run a small piece of code whenever a file is uploaded, pay only for the compute time used, and not manage any servers. Which service fits best?',
      options: [
        'Azure Virtual Machines',
        'Azure Virtual Desktop',
        'Azure Functions',
        'Azure Availability Sets',
      ],
      correctIndex: 2,
      explanation:
        'Azure Functions is event-driven and serverless: code runs when triggered, scales automatically, and you pay only for the compute time used. A VM would be billed while running, even when idle.',
    },
    {
      id: '5-09',
      question:
        'Which service lets you host web apps, REST APIs, WebJobs, and mobile back ends without managing the underlying infrastructure, with built-in autoscaling and high availability?',
      options: [
        'Azure Virtual Machines',
        'Azure App Service',
        'Azure ExpressRoute',
        'Azure Load Balancer',
      ],
      correctIndex: 1,
      explanation:
        'Azure App Service is an HTTP-based PaaS offering for web apps, API apps, WebJobs, and mobile apps on Windows or Linux. Azure Load Balancer only distributes traffic and does not host applications.',
    },
    {
      id: '5-10',
      question:
        'An employee works from home and needs to securely connect a single laptop to an Azure virtual network. Which connection type is intended for this scenario?',
      options: [
        'Site-to-site VPN',
        'Azure ExpressRoute',
        'Point-to-site VPN',
        'Virtual network peering',
      ],
      correctIndex: 2,
      explanation:
        'In a point-to-site connection, an individual client computer starts an encrypted VPN connection to the Azure virtual network. A site-to-site VPN connects an entire on-premises network through a VPN device or gateway.',
    },
    {
      id: '5-11',
      question:
        'Which Azure resource filters network traffic between subnets using rules based on source and destination IP address, port, and protocol?',
      options: [
        'Network security group',
        'Azure DNS zone',
        'Route table',
        'VPN gateway',
      ],
      correctIndex: 0,
      explanation:
        'A network security group contains inbound and outbound security rules that filter traffic on IP address, port, and protocol. A route table controls where traffic is sent, not whether it is allowed.',
    },
    {
      id: '5-12',
      question: 'What is true about virtual network peering in Azure?',
      options: [
        'It requires a VPN gateway in each virtual network',
        'It can only connect virtual networks within the same region',
        'It sends traffic over the public internet in encrypted form',
        'It connects virtual networks directly, even across regions, over the Microsoft backbone network',
      ],
      correctIndex: 3,
      explanation:
        'Peering links two virtual networks directly and the traffic stays private on the Microsoft backbone, never touching the public internet. It also works across regions (global peering).',
    },
    {
      id: '5-13',
      question:
        'You need a VPN gateway that supports point-to-site connections and virtual network-to-virtual network connections. Which VPN type must you choose?',
      options: [
        'Policy-based',
        'Route-based',
        'Active-passive only',
        'Zone-local',
      ],
      correctIndex: 1,
      explanation:
        'Route-based VPN gateways are required for VNet-to-VNet, point-to-site, and multi-site connections, and for coexistence with an ExpressRoute gateway. Policy-based gateways use static IP definitions per tunnel and are more limited.',
    },
    {
      id: '5-14',
      question:
        'A company relies on Azure ExpressRoute but wants an alternative path to its virtual networks in case the ExpressRoute connection suffers a physical problem. What can it configure?',
      options: [
        'A VPN gateway as a failover path for ExpressRoute',
        'A second subscription with its own billing account',
        'A network security group on the ExpressRoute circuit',
        'An alias record pointing to the ExpressRoute circuit',
      ],
      correctIndex: 0,
      explanation:
        'A VPN gateway can be configured as a failover path for ExpressRoute, so connectivity to virtual networks is maintained if the private circuit fails. NSGs and alias records do not provide connectivity.',
    },
    {
      id: '5-15',
      question: 'Which statement about Azure ExpressRoute is correct?',
      options: [
        'It sends encrypted traffic over the public internet using IPsec tunnels',
        'It connects individual client devices to a virtual network',
        'It is a DNS service for hosting domain records in Azure',
        'It provides a dedicated private connection to Azure that does not travel over the public internet',
      ],
      correctIndex: 3,
      explanation:
        'ExpressRoute extends an on-premises network into Azure through a connectivity provider over a private circuit, which makes it more reliable and faster than internet-based connections. VPN gateways are the option that uses encrypted tunnels over the internet.',
    },
    {
      id: '5-16',
      question:
        'A company has on-premises sites in several countries, each connected to Azure with its own ExpressRoute circuit. It wants these sites to exchange data with each other through the Microsoft network. Which feature should it enable?',
      options: [
        'Azure DNS alias records',
        'Virtual network service endpoints',
        'ExpressRoute Global Reach',
        'Policy-based VPN gateway',
      ],
      correctIndex: 2,
      explanation:
        'ExpressRoute Global Reach links your ExpressRoute circuits so your on-premises sites can exchange data with each other. Service endpoints only secure access from a virtual network to Azure services such as storage.',
    },
    {
      id: '5-17',
      question:
        'Which benefit does Azure DNS get from being built on Azure Resource Manager?',
      options: [
        'It can register new domain names with registrars automatically',
        'It supports Azure RBAC, activity logs, and resource locking',
        'It no longer needs any DNS servers to answer queries',
        'It can only be used for private domains inside virtual networks',
      ],
      correctIndex: 1,
      explanation:
        'Because Azure DNS uses Azure Resource Manager, you can use RBAC, activity logs, and resource locks to secure and audit your DNS zones. Its reliability comes from a global anycast network of name servers, not from Resource Manager.',
    },
    {
      id: '5-18',
      question:
        'An Azure DNS alias record set points to a public IP address of an Azure resource. What happens if that IP address changes?',
      options: [
        'The alias record set is updated automatically during DNS resolution',
        'The record keeps returning the old IP address until it is edited manually',
        'The DNS zone is deleted and must be recreated',
        'The record is converted to a CNAME record that must be validated',
      ],
      correctIndex: 0,
      explanation:
        'Alias record sets reference an Azure resource such as a public IP, Traffic Manager profile, or CDN endpoint, and follow changes to its IP address automatically. A normal A record with a hard-coded IP would need a manual update.',
    },
    {
      id: '5-19',
      question:
        'Which three types of connections can an Azure VPN gateway provide? Select three.',
      options: [
        'Site-to-site connections between an on-premises datacenter and a virtual network',
        'A dedicated private circuit through a connectivity provider that never crosses the public internet',
        'Point-to-site connections from individual devices to a virtual network',
        'Virtual network peering over the Microsoft backbone network without any gateway',
        'Network-to-network connections between virtual networks',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'A VPN gateway supports site-to-site, point-to-site and network-to-network connections, all encrypted over the internet. The dedicated private circuit describes Azure ExpressRoute, and peering is a separate feature that needs no gateway.',
    },
    {
      id: '5-20',
      question:
        'Which two statements about public and private endpoints in Azure virtual networking are correct? Select two.',
      options: [
        'Public endpoints have a public IP address and can be accessed from anywhere in the world',
        'Private endpoints can be reached directly from the internet without any virtual network',
        "Private endpoints exist within a virtual network and use a private IP address from that network's address space",
        "Public endpoints use a private IP address from the virtual network's address space",
      ],
      correctIndexes: [0, 2],
      explanation:
        'Public endpoints are internet-facing with a public IP, whereas private endpoints live inside a virtual network with a private IP from its address space. The other two statements swap those characteristics.',
    },
  ],
}
