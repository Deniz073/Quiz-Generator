import type { Chapter } from '../types'

export const chapter11: Chapter = {
  id: '11-monitoring-tools',
  number: 11,
  title: 'Azure monitoring tools',
  questions: [
    {
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
  ],
}
