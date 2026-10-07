import type { Chapter } from '../types'

export const chapter12: Chapter = {
  id: '12-exam-tips',
  number: 12,
  title: 'Exam tips',
  questions: [
    {
      id: '12-01',
      question:
        'In the Azure portal, where would you go to create a new file storage (Azure Files share)?',
      options: [
        'Virtual machines',
        'Storage accounts',
        'Microsoft Entra ID',
        'Azure Monitor',
      ],
      correctIndex: 1,
      explanation:
        'Azure Files shares live inside a storage account, so you start from Storage accounts. Virtual machines is for compute, not storage.',
    },
    {
      id: '12-02',
      question:
        'In the Azure portal, where would you go to switch one of your users from single sign-on (SSO) to multifactor authentication (MFA)?',
      options: [
        'Azure Advisor',
        'Subscriptions',
        'Resource groups',
        'Microsoft Entra ID',
      ],
      correctIndex: 3,
      explanation:
        'User identities and authentication methods are managed in Microsoft Entra ID (formerly Azure Active Directory). Subscriptions and resource groups organize resources, not identities.',
    },
    {
      id: '12-03',
      question:
        'In the Azure portal, where would you go to get advice on how to save costs on your current resources?',
      options: [
        'Azure Advisor',
        'Azure Service Health',
        'Storage accounts',
        'Microsoft Entra ID',
      ],
      correctIndex: 0,
      explanation:
        'Azure Advisor evaluates your resources and includes cost-saving recommendations. Service Health reports on the status of Azure services, not on spending.',
    },
    {
      id: '12-04',
      question: 'Who can use the Azure TCO calculator?',
      options: [
        'Anyone with an Azure account',
        'Only customers with an Azure Enterprise account',
        'Anyone, no Azure account is required',
        'Only administrators of an Azure group',
      ],
      correctIndex: 2,
      explanation:
        'The TCO calculator is a free public web tool that needs no Azure account or subscription. It compares on-premises costs with Azure costs.',
    },
    {
      id: '12-05',
      question:
        'What can you do with an Azure Enterprise subscription that you cannot do with a regular Pay-As-You-Go account?',
      options: [
        'Manage Azure resources through the Azure portal',
        'Create a free Microsoft Entra ID account',
        'Get a free credit of 200 dollars for the first 30 days',
        'Sign an Enterprise Agreement and receive volume discounts',
      ],
      correctIndex: 3,
      explanation:
        'An Enterprise Agreement is a contract with Microsoft that gives volume discounts. The portal and Microsoft Entra ID are available to every account, and the 200 dollar credit belongs to the Azure free account.',
    },
    {
      id: '12-06',
      question:
        'A new user wants to try Azure services for 30 days using a free credit of 200 dollars. Which type of account offers this?',
      options: [
        'Azure free account',
        'Azure Enterprise Agreement',
        'Pay-As-You-Go subscription without a free offer',
        'Azure Cloud Solution Provider (CSP) partner subscription',
      ],
      correctIndex: 0,
      explanation:
        'The Azure free account includes a 200 dollar credit for the first 30 days, plus some services that stay free. Enterprise Agreements are contracts for large organizations focused on volume discounts, not trial credit.',
    },
    {
      id: '12-07',
      question:
        'Which two statements about the Azure free account are correct? Select two.',
      options: [
        'It requires signing an Enterprise Agreement with Microsoft',
        'It includes a credit of 200 dollars that can be used during the first 30 days',
        'Usage continues and is billed automatically after the credit is spent, without you upgrading',
        'It includes a number of services that remain free',
      ],
      correctIndexes: [1, 3],
      explanation:
        'The free account gives a 200 dollar credit for 30 days plus some services that stay free. After the credit is used up or the 30 days end, you must upgrade to pay-as-you-go to continue, and an Enterprise Agreement is a separate volume-discount contract.',
    },
    {
      id: '12-08',
      question:
        'In the Azure portal, which two tasks would you perform in Microsoft Entra ID? Select two.',
      options: [
        'Create a new user',
        'Create a new Azure Files share',
        'Review recommendations for reducing costs',
        'Add users to a group',
      ],
      correctIndexes: [0, 3],
      explanation:
        'Users and groups are identity objects managed in Microsoft Entra ID. Azure Files shares are created from Storage accounts, and cost-saving advice comes from Azure Advisor.',
    },
  ],
}
