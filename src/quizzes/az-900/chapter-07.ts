import type { Chapter } from '../types'

export const chapter07: Chapter = {
  id: '7-identity-access-security',
  number: 7,
  title: 'Azure identity, access and security',
  questions: [
    {
      id: '7-01',
      question:
        'Which service lets users sign in and access Microsoft cloud applications as well as cloud apps you develop yourself, and also supports single sign-on, MFA and device registration?',
      options: [
        'Azure Resource Manager',
        'Microsoft Intune',
        'Microsoft Defender for Cloud',
        'Microsoft Entra ID (formerly Azure Active Directory)',
      ],
      correctIndex: 3,
      explanation:
        'Microsoft Entra ID (formerly Azure AD) is the cloud directory and identity service for authentication, SSO, application management and device registration. Intune can manage registered devices but does not provide the directory itself.',
    },
    {
      id: '7-02',
      question:
        'A company migrated a legacy application to Azure VMs. The app needs domain join, Group Policy, LDAP and Kerberos/NTLM authentication, but the company does not want to deploy and manage domain controllers. What should it use?',
      options: [
        'Microsoft Entra Domain Services (formerly Azure AD DS)',
        'Azure AD B2C (business to consumer)',
        'Microsoft Entra Conditional Access',
        'Azure role-based access control (Azure RBAC)',
      ],
      correctIndex: 0,
      explanation:
        'Microsoft Entra Domain Services provides managed domain services (domain join, Group Policy, LDAP, Kerberos/NTLM) without you running domain controllers. Entra ID alone does not offer these legacy protocols.',
    },
    {
      id: '7-03',
      question:
        'A user signs in with a password and then has to confirm the sign-in with a fingerprint scan. Which authentication method is being used, and which factor does the fingerprint represent?',
      options: [
        'Single sign-on, something the user knows',
        'Multifactor authentication, something the user is',
        'Passwordless authentication, something the user has',
        'Multifactor authentication, something the user has',
      ],
      correctIndex: 1,
      explanation:
        'Requiring a second form of verification on top of a password is MFA. Biometric data is something the user is, whereas a code sent to a phone is something the user has and a password is something the user knows.',
    },
    {
      id: '7-04',
      question:
        'Which of the following is a passwordless authentication option in Azure?',
      options: [
        'Security questions',
        'Self-service password reset',
        'FIDO2 security keys',
        'A banned password list',
      ],
      correctIndex: 2,
      explanation:
        'The three passwordless options are Windows Hello, the Microsoft Authenticator app and FIDO2 security keys. Self-service password reset and the banned password list are features that still revolve around passwords.',
    },
    {
      id: '7-05',
      question:
        'Employees of a partner company must collaborate on your resources using their own corporate identities. They should appear as guest users in your directory. Which feature should be used?',
      options: [
        'Microsoft Entra B2B collaboration',
        'Azure AD B2C (business to consumer)',
        'Microsoft Entra Domain Services',
        'Microsoft Entra B2B direct connect',
      ],
      correctIndex: 0,
      explanation:
        'B2B collaboration lets external users sign in with their preferred identity and adds them to your directory as guest users. B2B direct connect is a mutual trust between two organizations and does not create guest users in your directory.',
    },
    {
      id: '7-06',
      question:
        'What characterizes B2B direct connect between two Microsoft Entra organizations?',
      options: [
        'It publishes SaaS apps to consumers with social sign-in',
        'It is a mutual, two-way trust relationship between the two organizations',
        'It synchronizes an on-premises Active Directory with Azure',
        'It blocks sign-ins from untrusted networks',
      ],
      correctIndex: 1,
      explanation:
        'B2B direct connect is a mutual, two-way trust relationship between two Microsoft Entra organizations. Publishing apps to customers is the purpose of B2C.',
    },
    {
      id: '7-07',
      question:
        'A company publishes a modern SaaS application to its customers and wants to manage the identities and access of those customers. Which service fits?',
      options: [
        'B2B collaboration',
        'Microsoft Entra Domain Services',
        'Azure AD B2C (now part of Microsoft Entra External ID)',
        'Windows Hello',
      ],
      correctIndex: 2,
      explanation:
        'Azure AD B2C (now Microsoft Entra External ID) is for customer-facing apps: it handles identity and access management for consumers. B2B collaboration is for partner organizations, not for customers.',
    },
    {
      id: '7-08',
      question:
        'A company wants to block access to a cloud app when users sign in from untrusted locations. Which Microsoft Entra capability evaluates signals such as location, device and user identity to make such decisions?',
      options: [
        'Conditional Access',
        'Azure resource locks',
        'Azure RBAC',
        'Single sign-on',
      ],
      correctIndex: 0,
      explanation:
        'Conditional Access allows or blocks access, or requires MFA, based on identity signals like location, device and user. RBAC controls what an authenticated user can do on resources, not how they sign in.',
    },
    {
      id: '7-09',
      question:
        'How can Conditional Access improve the experience of end users?',
      options: [
        'It removes the need for any authentication at all',
        'It stores passwords for all applications in one vault',
        'It encrypts all traffic between the user and Azure',
        'It can skip the MFA prompt when the user signs in from a trusted location or device',
      ],
      correctIndex: 3,
      explanation:
        'Because policies depend on signals, MFA can be waived when the sign-in comes from a trusted location or managed device. Authentication is never removed entirely.',
    },
    {
      id: '7-10',
      question:
        'A user is assigned the Contributor role at the resource group scope. What access does the user get for the resources inside that resource group?',
      options: [
        'None, roles only apply to the resource group itself',
        'Access to the other resource groups in the same subscription as well',
        'The same Contributor access, because Azure RBAC permissions are inherited by child scopes',
        'Read-only access, because inheritance always downgrades permissions',
      ],
      correctIndex: 2,
      explanation:
        'Azure RBAC is hierarchical: access granted at a parent scope (management group, subscription, resource group) is inherited by all child scopes below it, but not by sibling scopes.',
    },
    {
      id: '7-11',
      question:
        'Which of the following is a valid scope to which an Azure RBAC role can be assigned?',
      options: [
        'A management group',
        'An Azure region',
        'A virtual network address range',
        'An availability zone',
      ],
      correctIndex: 0,
      explanation:
        'The scopes are management group, subscription, resource group and individual resource. Regions, address ranges and availability zones are not RBAC scopes.',
    },
    {
      id: '7-12',
      question: 'How is Azure RBAC enforced?',
      options: [
        'By Microsoft Defender for Cloud scanning every VM',
        'By network security groups attached to subnets',
        'By Azure Policy blocking non-compliant deployments',
        'By sending requests through Azure Resource Manager, where RBAC is applied to every action',
      ],
      correctIndex: 3,
      explanation:
        'Every action goes through Azure Resource Manager, and Azure RBAC is evaluated on top of it. NSGs filter network traffic and Azure Policy enforces resource compliance, neither enforces user permissions.',
    },
    {
      id: '7-13',
      question:
        'Which security model assumes a breach has already happened and verifies every request as if it originated from an open network?',
      options: [
        'Defense in depth',
        'Zero Trust',
        'Role-based access control',
        'Single sign-on',
      ],
      correctIndex: 1,
      explanation:
        'Zero Trust starts from the assumption of breach and verifies each request explicitly. Defense in depth is a layered protection model, not a verification model.',
    },
    {
      id: '7-14',
      question:
        'Which Zero Trust principle is implemented by granting users just-in-time (JIT) and just-enough-access (JEA)?',
      options: [
        'Verify explicitly',
        'Assume breach',
        'Use least privilege access',
        'Encrypt end to end',
      ],
      correctIndex: 2,
      explanation:
        'JIT and JEA limit users to the minimum access, for the minimum time, which is the least privilege access principle. Verify explicitly is about authenticating and authorizing on all available data points.',
    },
    {
      id: '7-15',
      question:
        'A company uses DDoS protection to filter large-scale attacks before they reach its network. Which layer of defense in depth does this belong to?',
      options: ['Data', 'Compute', 'Application', 'Perimeter'],
      correctIndex: 3,
      explanation:
        'The perimeter layer protects against network attacks with DDoS protection and perimeter firewalls. The Network layer, by contrast, limits connectivity between resources.',
    },
    {
      id: '7-16',
      question:
        'An architect restricts communication between resources, denies access by default and sets up secure connections to on-premises networks. Which defense-in-depth layer is being addressed?',
      options: [
        'Network',
        'Perimeter',
        'Identity and access',
        'Physical security',
      ],
      correctIndex: 0,
      explanation:
        'The Network layer limits connectivity to what is strictly required to reduce the spread of an attack. The Perimeter layer deals with filtering attacks at the network edge, such as DDoS.',
    },
    {
      id: '7-17',
      question:
        'Which layer is the first line of defense in the defense-in-depth model, covering buildings and access to hardware?',
      options: [
        'Perimeter',
        'Physical security',
        'Compute',
        'Identity and access',
      ],
      correctIndex: 1,
      explanation:
        'Physical security protects buildings and controls physical access to hardware, and is the first line of defense. Identity and access follows and concerns securing identities, SSO and MFA.',
    },
    {
      id: '7-18',
      question:
        'A company wants a tool that assesses and strengthens the security posture of its Azure resources and can also protect resources running in Amazon Web Services. Which should it use?',
      options: [
        'Microsoft Entra Conditional Access',
        'Azure Monitor',
        'Microsoft Defender for Cloud',
        'Azure Advisor',
      ],
      correctIndex: 2,
      explanation:
        'Microsoft Defender for Cloud is the Azure security management and threat protection service, and it also covers multicloud resources such as AWS (and GCP). Azure Advisor gives general best-practice recommendations, not threat protection.',
    },
    {
      id: '7-19',
      question:
        'Which three are guiding principles of the Zero Trust model? Select three.',
      options: [
        'Trust all requests that originate from the internal corporate network',
        'Verify explicitly',
        'Use least privilege access',
        'Rely on a strong network perimeter as the only line of defense',
        'Assume breach',
      ],
      correctIndexes: [1, 2, 4],
      explanation:
        'Zero Trust is built on verifying explicitly, using least privilege access (for example just-in-time and just-enough-access) and assuming breach. Implicitly trusting the internal network or relying on the perimeter alone is exactly what Zero Trust moves away from.',
    },
    {
      id: '7-20',
      question:
        'Which three capabilities are provided by Microsoft Entra ID (formerly Azure Active Directory)? Select three.',
      options: [
        'Single sign-on (SSO) to multiple applications',
        'Filtering inbound and outbound network traffic between subnets with security rules',
        'Registration of devices so they can be managed with tools such as Microsoft Intune',
        'Managed domain controllers that provide Group Policy and LDAP',
        'Multifactor authentication and self-service password reset',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'Microsoft Entra ID offers authentication (including MFA and self-service password reset), single sign-on, application management and device registration. Traffic filtering is done by network security groups, and Group Policy and LDAP come from Microsoft Entra Domain Services.',
    },
  ],
}
