import type { Chapter } from '../types'

export const chapter11: Chapter = {
  id: '11-monitoring-tools',
  number: 11,
  title: 'Azure monitoring tools',
  questions: [
    {
      id: '11-01',
      question:
        'Which Azure service evaluates your existing resources and gives recommendations to improve reliability, security and performance, optimize operations and reduce costs?',
      options: [
        'Azure Monitor',
        'Azure Advisor',
        'Azure Service Health',
        'Azure Cost Management',
      ],
      correctIndex: 1,
      explanation:
        'Azure Advisor analyzes your resources and recommends improvements. Azure Cost Management only covers the cost side, and Azure Monitor collects telemetry rather than giving recommendations.',
    },
    {
      id: '11-02',
      question:
        'A company notices that several virtual machines are barely used and wants Azure to suggest how to lower its bill. Which service provides this advice?',
      options: [
        'Azure Service Health',
        'Azure Arc',
        'Azure Advisor',
        'Azure Resource Manager',
      ],
      correctIndex: 2,
      explanation:
        'Azure Advisor includes cost recommendations, such as resizing or shutting down underused VMs. Service Health reports on service issues, not savings.',
    },
    {
      id: '11-03',
      question:
        'Which Azure service automatically keeps track of the health of your Azure infrastructure and individual resources, so you do not have to check this manually?',
      options: [
        'Azure Advisor',
        'Azure Blueprints',
        'Azure Service Trust Portal',
        'Azure Service Health',
      ],
      correctIndex: 3,
      explanation:
        'Azure Service Health tracks the status of Azure services and your resources automatically. Azure Advisor gives optimization recommendations, not health status.',
    },
    {
      id: '11-04',
      question:
        'A web application becomes slow, and the team wants to analyze request handling times and CPU usage and to be alerted automatically about performance problems. Which service should they use?',
      options: [
        'Azure Monitor',
        'Azure Service Health',
        'Azure Advisor',
        'Azure Cost Management',
      ],
      correctIndex: 0,
      explanation:
        'Azure Monitor collects and analyzes telemetry from applications, from request speed down to CPU usage, and can alert on performance. Advisor only gives general recommendations.',
    },
    {
      id: '11-05',
      question: 'Which task is Azure Monitor designed for?',
      options: [
        'Estimating the price of a planned Azure deployment',
        'Locking resources against accidental deletion',
        'Collecting and analyzing logging and telemetry data from your applications',
        'Standardizing environments with repeatable policies',
      ],
      correctIndex: 2,
      explanation:
        'Azure Monitor tracks, logs and analyzes telemetry and automates performance alerts. Price estimates come from the Pricing calculator and locks from resource locking.',
    },
    {
      id: '11-06',
      question:
        'An administrator wants to know whether a problem on one of their Azure resources is caused by an issue on the Azure platform or by their own configuration. Which service helps to find out?',
      options: [
        'Azure Cost Management',
        'Azure Service Health',
        'TCO calculator',
        'Azure Cloud Shell',
      ],
      correctIndex: 1,
      explanation:
        'Azure Service Health shows the health of Azure services and your individual resources, so you can see whether Azure itself is having an issue. Cost Management and the TCO calculator deal only with money.',
    },
    {
      id: '11-07',
      question:
        'A security officer wants a list of suggestions to improve the security posture and reliability of the existing Azure resources. Which service gives these suggestions?',
      options: [
        'Azure Monitor',
        'Azure Service Health',
        'Azure Resource Manager',
        'Azure Advisor',
      ],
      correctIndex: 3,
      explanation:
        'Azure Advisor evaluates your resources and recommends improvements in reliability, security, performance, operations and cost. Azure Monitor shows telemetry but does not give such recommendations.',
    },
    {
      id: '11-08',
      question:
        'Azure Advisor provides recommendations in which three categories? Select three.',
      options: [
        'Security',
        'Reliability',
        'Data residency',
        'Cost',
        'Licensing',
      ],
      correctIndexes: [0, 1, 3],
      explanation:
        'Azure Advisor recommends improvements in reliability, security, performance, operational excellence and cost. Data residency and licensing are not Advisor categories.',
    },
    {
      id: '11-09',
      question:
        'Which two questions can Azure Service Health help you answer? Select two.',
      options: [
        'Is an issue on the Azure platform, rather than my own configuration, causing the problem with my resource?',
        'Which of my virtual machines are underused and could be resized to save money?',
        'How much will my planned deployment cost per month?',
        'Is planned maintenance scheduled for Azure services that I use?',
      ],
      correctIndexes: [0, 3],
      explanation:
        'Service Health tracks the health of Azure services and your resources, including incidents and planned maintenance. Resizing advice comes from Azure Advisor, and cost estimates from the Pricing calculator.',
    },
    {
      id: '11-10',
      question:
        'You need a custom solution that uses thresholds to trigger autoscaling, scaling an app up or down to meet user demand. What should you include?',
      options: [
        'Azure Advisor',
        'Azure Service Health',
        'Azure Monitor',
        'Azure Cost Management',
      ],
      correctIndex: 2,
      explanation:
        'Azure Monitor collects metric and log data such as CPU percentage, and autoscale rules use these metrics as thresholds to scale out or in. Advisor only gives recommendations and Service Health reports platform incidents.',
    },
    {
      id: '11-11',
      question:
        'Which Azure Monitor tool do you use to write and run queries on collected log data with the Kusto Query Language (KQL)?',
      options: [
        'Azure Advisor',
        'Azure Service Health',
        'Azure Cost Management',
        'Log Analytics',
      ],
      correctIndex: 3,
      explanation:
        'Log Analytics is the Azure Monitor tool for writing and running KQL queries on log data, interactively or as the basis for alerts and workbooks. Service Health reports Azure platform issues and does not query your logs.',
    },
    {
      id: '11-12',
      question:
        "A team wants to monitor a web application's request rates, response times, failure rates and page views, also for an app hosted outside Azure. Which Azure Monitor feature is designed for this?",
      options: [
        'Azure Resource Health',
        'Application Insights',
        'Azure Advisor',
        'Microsoft Defender for Cloud',
      ],
      correctIndex: 1,
      explanation:
        'Application Insights is the application performance monitoring (APM) feature of Azure Monitor. It tracks requests, dependencies, exceptions and page views for apps in Azure, on-premises or in another cloud.',
    },
    {
      id: '11-13',
      question:
        "An Azure Monitor alert fires when a VM's CPU usage stays above 90%. What defines who is notified and which actions run, such as sending an email or SMS or starting an automation?",
      options: [
        'A resource lock',
        'A policy initiative',
        'An action group',
        'A management group',
      ],
      correctIndex: 2,
      explanation:
        'An action group is a reusable set of notifications (email, SMS, push, voice) and actions (such as a function, logic app or webhook) that alerts trigger. The alert rule decides when to fire; the action group decides what happens.',
    },
    {
      id: '11-14',
      question:
        'Azure Service Health combines three views. Which one gives a global overview of the state of all Azure services in all regions, not only the ones you use?',
      options: [
        'Azure status',
        'Service health',
        'Resource Health',
        'Azure Monitor metrics',
      ],
      correctIndex: 0,
      explanation:
        'Azure status is the broad, public view of Azure service health across all regions. Service health narrows this down to the services and regions you use, and Resource Health covers your individual resources, such as a specific VM.',
    },
    {
      id: '11-15',
      question:
        'Which statement about the data sources of Azure Monitor is correct?',
      options: [
        'It collects data only from resources running in Azure',
        'It can collect metrics and logs from Azure resources as well as from on-premises servers and other clouds',
        'It collects data, but the data must be exported to a third-party tool before it can be analyzed',
        'It only monitors the health of the Azure platform itself, not your resources',
      ],
      correctIndex: 1,
      explanation:
        'Azure Monitor collects, analyzes and acts on telemetry from Azure, on-premises and multicloud environments. Platform health is covered by Service Health, and you analyze the data in Azure Monitor itself, for example with Log Analytics.',
    },
  ],
}
