import type { Chapter } from '#/quizzes/types'

export const chapter14: Chapter = {
  id: '14-foundry-iq',
  number: 14,
  title: 'Knowledge with Foundry IQ',
  questions: [
    {
      id: '14-01',
      question: 'What is the primary purpose of Microsoft Foundry IQ?',
      options: [
        'To train a new foundation model on every document in an organization',
        'To provide a managed knowledge layer that agents use to retrieve permission-aware enterprise information',
        'To replace AI agents with a keyword search page',
        'To store conversation history for a single agent',
      ],
      correctIndex: 1,
      explanation:
        'Foundry IQ organizes enterprise and web data into reusable knowledge bases and returns relevant, permission-aware information with citations.',
    },
    {
      id: '14-02',
      question:
        'Which Azure service provides the underlying indexing and retrieval infrastructure for Foundry IQ?',
      options: [
        'Azure Cosmos DB',
        'Azure Key Vault',
        'Azure AI Search',
        'Azure Content Understanding',
      ],
      correctIndex: 2,
      explanation:
        'A Foundry IQ solution is based on an Azure AI Search resource that handles knowledge retrieval.',
    },
    {
      id: '14-03',
      question:
        'Which three components make up a Foundry IQ solution? Select three.',
      options: [
        'Knowledge base',
        'Knowledge source',
        'Agentic retrieval',
        'A fine-tuning pipeline',
        'A speech synthesis voice',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'A knowledge base groups related knowledge sources and controls retrieval; knowledge sources connect to content; agentic retrieval plans, searches, ranks and returns cited results.',
    },
    {
      id: '14-04',
      question: 'What does agentic retrieval do with a complex user question?',
      options: [
        'It breaks the question into subqueries, searches relevant sources in parallel, ranks the results and returns cited evidence',
        'It adds the question and answer permanently to the model training data',
        'It runs an exact keyword match on every source and returns unranked results',
        'It forwards the question to a human expert',
      ],
      correctIndex: 0,
      explanation:
        'Agentic retrieval plans the searches, coordinates multiple sources and returns a unified response with source references.',
    },
    {
      id: '14-05',
      question:
        'An organization builds a finance agent, a workplace agent and a vacation agent. What is the main benefit of using Foundry IQ for their knowledge?',
      options: [
        'Each agent gets its own separate RAG pipeline',
        'The agents no longer need a language model',
        'Permissions no longer need to be configured',
        'Multiple agents can share centrally managed knowledge bases, so improvements benefit every connected agent',
      ],
      correctIndex: 3,
      explanation:
        'Building a separate RAG pipeline per agent duplicates work and gives inconsistent results. Shared knowledge bases per business domain avoid that.',
    },
    {
      id: '14-06',
      question: 'How does an agent connect to a Foundry IQ knowledge base?',
      options: [
        'By uploading the knowledge base into the system prompt',
        'Through a Model Context Protocol (MCP) tool exposed by the knowledge base',
        'By fine-tuning the agent model on the knowledge base',
        'Through a direct database connection string in the agent instructions',
      ],
      correctIndex: 1,
      explanation:
        'Knowledge bases expose an MCP tool that you add to the agent. The agent instructions then tell it when and how to use the knowledge base.',
    },
    {
      id: '14-07',
      question:
        'To test knowledge retrieval in the agent playground, which role must the managed identity of the Foundry project have on the Azure AI Search resource?',
      options: [
        'Owner',
        'Search Service Contributor',
        'Search Index Data Reader',
        'Key Vault Secrets User',
      ],
      correctIndex: 2,
      explanation:
        'The project managed identity (and the identity of any production agent) needs the Search Index Data Reader role to retrieve content. More privileged roles are not needed.',
    },
    {
      id: '14-08',
      question: 'What does a Foundry IQ knowledge base contain?',
      options: [
        'One or more knowledge sources plus settings that control retrieval behavior, including a generative AI model for agentic retrieval',
        'Only the conversation history for one agent',
        'Only documents uploaded directly to a language model',
        'A copy of all Azure subscriptions in the tenant',
      ],
      correctIndex: 0,
      explanation:
        'You can also define prompts that tell Foundry IQ which sources to prioritize for specific information and how to shape responses.',
    },
    {
      id: '14-09',
      question:
        'Which sources can be connected as knowledge sources in Foundry IQ? Select three.',
      options: [
        'Documents in Azure Blob Storage',
        'Microsoft SharePoint content',
        'Existing Azure AI Search indexes',
        'Live telephone calls',
        'A local folder on a developer laptop',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'Supported sources include existing Azure AI Search indexes, Blob Storage, SharePoint, OneLake and public web content. The exact options can change as Foundry IQ evolves.',
    },
    {
      id: '14-10',
      question:
        'A team wants to add every available data source to one big knowledge base. Why is that not necessarily helpful?',
      options: [
        'Knowledge bases are limited to one source',
        'More sources always make the agent slower to deploy',
        'Agents can only query one knowledge base at a time',
        'Unrelated or contradictory content can make retrieval less precise',
      ],
      correctIndex: 3,
      explanation:
        'A knowledge base should contain sources that belong together and answer a clear set of questions. Consider scope, authority, freshness, metadata, content quality and access.',
    },
    {
      id: '14-11',
      question:
        'Which agent instruction helps produce grounded answers when using a knowledge base?',
      options: [
        'Always give an answer, even if you have to guess',
        'Base factual claims on retrieved content, cite the sources, and say you do not know when the knowledge base lacks the information',
        'Ignore the knowledge base for questions about policies',
        'Never mention where information comes from',
      ],
      correctIndex: 1,
      explanation:
        'Connecting a knowledge base does not guarantee consistent use. Instructions should define when to retrieve, how to use evidence, how to cite, and what to do when evidence is missing.',
    },
    {
      id: '14-12',
      question:
        'Which two practices help protect enterprise information in a Foundry IQ solution? Select two.',
      options: [
        'Use identities and access controls so retrieval returns only content the caller is authorized to see',
        'Give the project connection only the permissions required to retrieve content',
        'Copy all sources into one public index so every agent sees the same content',
        'Treat retrieved document text as agent instructions',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Foundry IQ enforces user permissions (and sensitivity labels) for supported sources; least privilege limits the impact of mistakes. Retrieved text must be treated as data, not instructions.',
    },
    {
      id: '14-13',
      question:
        'Why should an agent be instructed to cite knowledge base sources?',
      options: [
        'Citations allow the agent to bypass permissions',
        'Citations make the model retrain itself after every answer',
        'Citations help users trace and verify the evidence behind a response',
        'Citations reduce token usage',
      ],
      correctIndex: 2,
      explanation:
        'Citations let users inspect the supporting content and notice when a source may be outdated or inappropriate.',
    },
    {
      id: '14-14',
      question:
        'When testing a knowledge-enhanced agent, which two practices does the course recommend? Select two.',
      options: [
        'Evaluate retrieval and the final response separately',
        'Include content that tries to change the agent instructions',
        'Only test straightforward questions that have one clear source',
        'Test with a single user who has access to everything',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Test ambiguous questions, questions without an answer, users with different permissions and prompt-injection attempts. First check the retrieved evidence, then the grounded response.',
    },
  ],
}
