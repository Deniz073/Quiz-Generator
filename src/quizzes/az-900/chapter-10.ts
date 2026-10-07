import type { Chapter } from '../types'

export const chapter10: Chapter = {
  id: '10-deployment-and-management-tools',
  number: 10,
  title: 'Deployment and management tools',
  questions: [
    {
      id: '10-01',
      question:
        'Which Azure tool is a web-based console where you can manage your Azure environments, resources and policies through a graphical interface?',
      options: [
        'Azure Portal',
        'Azure CLI',
        'Azure PowerShell',
        'Azure Resource Manager templates',
      ],
      correctIndex: 0,
      explanation:
        'The Azure portal is the web console for managing Azure. Azure CLI and PowerShell are command-line tools, and ARM templates are deployment files.',
    },
    {
      id: '10-02',
      question:
        'A consultant needs to manage Azure resources from a laptop that has no tools installed, using only a web browser. Which service should they use?',
      options: [
        'Azure Arc',
        'Azure Advisor',
        'Azure Cloud Shell',
        'Azure Service Health',
      ],
      correctIndex: 2,
      explanation:
        'Azure Cloud Shell is a browser-based shell to create, configure and manage Azure resources, and it supports both Azure PowerShell and Azure CLI. Azure Arc manages non-Azure resources and has nothing to do with local shells.',
    },
    {
      id: '10-03',
      question:
        'Azure PowerShell runs administrative commands named cmdlets. What do these cmdlets call to perform management tasks in Azure?',
      options: [
        'The Azure REST API',
        'The Azure Marketplace API',
        'The Service Trust Portal',
        'Azure Monitor agents',
      ],
      correctIndex: 0,
      explanation:
        'Azure PowerShell cmdlets call the Azure REST API. You can run them individually for a one-off change or combine them to perform complex actions.',
    },
    {
      id: '10-04',
      question:
        'Your team has strong Bash scripting experience and wants to automate Azure management from the command line. Which tool is the most natural choice?',
      options: [
        'Azure Portal',
        'Azure PowerShell, because it is the only scriptable option',
        'Azure Service Health',
        'Azure CLI',
      ],
      correctIndex: 3,
      explanation:
        'Azure CLI is functionally equivalent to Azure PowerShell but uses Bash-style commands, so the choice depends on which language you know best. PowerShell is not the only scriptable option.',
    },
    {
      id: '10-05',
      question:
        'A company runs virtual machines and Kubernetes clusters on-premises and in another cloud. It wants to manage them with Azure management tools as if they ran in Azure. Which service enables this?',
      options: [
        'Azure Cloud Shell',
        'Azure Advisor',
        'Azure Blueprints',
        'Azure Arc',
      ],
      correctIndex: 3,
      explanation:
        'Azure Arc projects existing non-Azure resources into Azure Resource Manager so you can manage hybrid and multicloud servers, Kubernetes clusters and databases centrally. Cloud Shell is only a command-line environment.',
    },
    {
      id: '10-06',
      question: 'What is Azure Resource Manager (ARM)?',
      options: [
        'A service that estimates the cost of Azure resources',
        'The deployment and management service for Azure, used to create, update and delete resources',
        'A browser-based shell for Azure CLI and PowerShell',
        'A monitoring service that collects telemetry from applications',
      ],
      correctIndex: 1,
      explanation:
        'ARM is the deployment and management layer of Azure, and the portal, CLI, PowerShell and templates all go through it. The browser-based shell is Cloud Shell and telemetry is handled by Azure Monitor.',
    },
    {
      id: '10-07',
      question: 'Which statement about ARM templates is correct?',
      options: [
        'They are JSON files that declare the desired configuration of your resources',
        'They are Bash scripts that run commands step by step',
        'They are only usable for a single resource at a time',
        'They can only be created by Microsoft',
      ],
      correctIndex: 0,
      explanation:
        'An ARM template is a JSON file that declares the resources you want, and ARM creates them together. Because it is declarative, you describe the result instead of writing imperative commands.',
    },
    {
      id: '10-08',
      question:
        'A team deploys the same environment for dev, test and production and needs every deployment to be exactly identical. Which ARM template benefit addresses this?',
      options: [
        'Extensibility',
        'Orchestration',
        'Repeatable results',
        'Modular files',
      ],
      correctIndex: 2,
      explanation:
        'Deploying the same ARM template several times gives the same result each time. Orchestration is about how ARM deploys the resources inside one template, not about repeating deployments.',
    },
    {
      id: '10-09',
      question:
        'A template contains a virtual machine that needs a network interface and a virtual network before it can be created. How does ARM make sure the resources are deployed correctly?',
      options: [
        'You must deploy each resource manually in the right order',
        'ARM creates all resources at random and retries until it works',
        'Azure Advisor reorders the resources before deployment',
        'You define dependencies between resources and ARM deploys them in the right order, in parallel where possible',
      ],
      correctIndex: 3,
      explanation:
        'ARM handles orchestration: it uses the defined dependencies to deploy resources in the correct order and as fast as possible. You never have to script the sequence yourself.',
    },
    {
      id: '10-10',
      question:
        'A template has grown very large. Which ARM template feature lets you split it into smaller, reusable parts that are linked during deployment?',
      options: [
        'Modular files',
        'Declarative syntax',
        'Repeatable results',
        'Resource locks',
      ],
      correctIndex: 0,
      explanation:
        'Modular files let you break a template into smaller reusable templates and link them at deployment time. Declarative syntax is about describing what to deploy rather than how.',
    },
    {
      id: '10-11',
      question:
        'Which two statements about ARM templates are correct? Select two.',
      options: [
        'You declare the resources you want instead of writing step-by-step commands',
        'Each resource in a template must be deployed in a separate manual run',
        'You can add PowerShell or Bash scripts to a template to configure resources during deployment',
        'A template can only deploy resources of a single type',
      ],
      correctIndexes: [0, 2],
      explanation:
        'ARM templates use declarative syntax and support extensibility through scripts that run during deployment. A single template can deploy many resource types together, and Azure Resource Manager orchestrates the deployment order for you.',
    },
    {
      id: '10-12',
      question:
        'Which two statements about Azure CLI and Azure PowerShell are correct? Select two.',
      options: [
        'Azure CLI works only on Linux',
        'Both can be used from Azure Cloud Shell',
        'Both can be installed on Windows, macOS and Linux',
        'Azure PowerShell can only manage virtual machines',
      ],
      correctIndexes: [1, 2],
      explanation:
        'Azure Cloud Shell supports both tools, and both are cross-platform with functionally similar management capabilities, so the choice depends on which syntax you know best. Neither is limited to one operating system or one resource type.',
    },
  ],
}
