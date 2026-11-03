import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: '8-azure-foundry',
  number: 8,
  title: 'AI on Azure and Microsoft Foundry',
  questions: [
    {
      id: '8-01',
      question:
        'Which statement best explains the relationship between AI and machine learning (ML)?',
      options: [
        'AI and ML are interchangeable terms',
        'AI is the overall goal of systems that show human-like intelligence; ML is a data-driven method to achieve it by learning patterns from data',
        'ML is limited to generative tasks, while AI is limited to planning',
        'ML is a type of hardware that runs AI software',
      ],
      correctIndex: 1,
      explanation:
        'ML models are the engines inside AI applications: mathematical systems trained on data to recognize patterns and make predictions or generate output.',
    },
    {
      id: '8-02',
      question:
        'When you interact with an AI application, the model applies what it learned during training to your new input. What is this called?',
      options: ['Fine-tuning', 'Tokenization', 'Inference', 'Deployment'],
      correctIndex: 2,
      explanation:
        'Inference is running a trained model on new input to produce output. Fine-tuning changes the model with additional training.',
    },
    {
      id: '8-03',
      question:
        'What is the correct hierarchy for organizing access and management in Azure, from top to bottom?',
      options: [
        'Subscription, tenant, resource, resource group',
        'Resource group, subscription, tenant, resource',
        'Tenant, resource group, subscription, resource',
        'Tenant, subscription, resource group, resource',
      ],
      correctIndex: 3,
      explanation:
        'A tenant (the organization identity) contains one or more subscriptions, which contain resource groups, which contain resources.',
    },
    {
      id: '8-04',
      question:
        'Which Azure construct ties resource usage to a payment method and sets boundaries for cost, quotas and access control?',
      options: [
        'A subscription',
        'A resource group',
        'A tenant',
        'A Foundry project',
      ],
      correctIndex: 0,
      explanation:
        'A subscription is the billing container. A resource group is a folder of related resources managed together.',
    },
    {
      id: '8-05',
      question:
        'Where should an AI application store the API key it uses to call a model endpoint?',
      options: [
        'Hard-coded in the source code',
        'In a GitHub repository',
        'As a secret in Azure Key Vault, retrieved at run time with a managed identity',
        'In the prompt that is sent to the model',
      ],
      correctIndex: 2,
      explanation:
        'Secrets such as keys and connection strings belong in Azure Key Vault, not in code or GitHub. The app retrieves them securely at run time, for example with a managed identity.',
    },
    {
      id: '8-06',
      question:
        'Which statement best describes how keys, secrets and endpoints work together in an Azure-based AI application?',
      options: [
        'The endpoint stores the secrets, and the key limits how much data it returns',
        'The key is where model responses are stored',
        'The endpoint and the key are the same thing',
        'The endpoint is the URL for calling a deployed model, and the key (stored as a secret) authenticates the request',
      ],
      correctIndex: 3,
      explanation:
        'Applications call the endpoint URL and present a key or a Microsoft Entra ID token to authenticate.',
    },
    {
      id: '8-07',
      question:
        'Which Azure service provides identity and role-based access control (RBAC) so only the right people and services can access AI resources?',
      options: [
        'Azure Kubernetes Service',
        'Microsoft Entra ID',
        'Azure App Service',
        'Azure Cosmos DB',
      ],
      correctIndex: 1,
      explanation:
        'Microsoft Entra ID handles identity and enables RBAC to limit access to model deployments, resources and data.',
    },
    {
      id: '8-08',
      question:
        'An AI app gets more traffic, so you add more instances of it. What type of scaling is this?',
      options: [
        'Scale out (horizontal scaling)',
        'Scale up (vertical scaling)',
        'Throttling',
        'Provisioning',
      ],
      correctIndex: 0,
      explanation:
        'Scaling out adds instances; scaling up adds CPU or memory to an existing instance.',
    },
    {
      id: '8-09',
      question:
        'Which Azure service orchestrates large numbers of containers for containerized AI workloads?',
      options: [
        'Azure Key Vault',
        'Azure App Service',
        'Azure Kubernetes Service (AKS)',
        'Azure SQL Database',
      ],
      correctIndex: 2,
      explanation:
        'AKS orchestrates containers. Azure App Service hosts web apps, APIs and background jobs without you managing the servers.',
    },
    {
      id: '8-10',
      question: 'How does Microsoft Foundry relate to Azure?',
      options: [
        'Foundry runs independently from Azure',
        'Foundry replaces Azure as a separate cloud platform',
        'Foundry is a PaaS built on Azure that uses Azure compute, networking, identity and security to build and run AI apps and agents',
        'Foundry is an on-premises tool that exports models to Azure',
      ],
      correctIndex: 2,
      explanation:
        'Foundry is a unified, enterprise-grade platform-as-a-service on Azure for building, deploying and managing AI applications and agents.',
    },
    {
      id: '8-11',
      question:
        'What is the relationship between a Foundry resource and a Foundry project?',
      options: [
        'A project is a workspace inside a Foundry resource where you build agents, evaluations and apps',
        'A resource is a workspace inside a project',
        'They are two names for the same thing',
        'A project is a billing container that holds several resources',
      ],
      correctIndex: 0,
      explanation:
        'The Foundry resource is the Azure resource that provides models, the agent service, governance and security boundaries. A team might have one resource with many projects, one per use case.',
    },
    {
      id: '8-12',
      question:
        'Which two tasks are responsibilities of the client application in a client-server AI solution? Select two.',
      options: [
        'Collecting user input and formatting it into a request',
        'Displaying the returned output to the user',
        'Running inference on the model',
        'Applying system instructions and safety settings on the server',
      ],
      correctIndexes: [0, 1],
      explanation:
        'The client presents a UI, collects input, sends the request and displays the result. The server (in Foundry, the model deployment) runs inference and applies safety and system instructions.',
    },
    {
      id: '8-13',
      question:
        'Why do most developers use SDKs rather than calling the REST interface of a Foundry endpoint directly?',
      options: [
        'Because the REST interface is only available in the portal',
        'Because SDKs work without authentication',
        'Because SDKs run the model locally',
        'Because SDKs wrap the REST calls in code libraries for their programming language',
      ],
      correctIndex: 3,
      explanation:
        'SDKs for languages such as Python, JavaScript or C# build the REST requests (headers plus JSON body) for you. They still need an endpoint and authentication.',
    },
    {
      id: '8-14',
      question:
        'Which two ways can an application authenticate to a protected Foundry endpoint? Select two.',
      options: [
        'An API key',
        'A Microsoft Entra ID token',
        'The deployment name',
        'The Azure region of the resource',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Endpoints accept either the correct API key or an Entra ID token. The deployment name identifies which model to call but does not authenticate.',
    },
  ],
}
