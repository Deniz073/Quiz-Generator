import type { Chapter } from '#/quizzes/types'

export const chapter10: Chapter = {
  id: '10-foundry-text',
  number: 10,
  title: 'Text analysis with Azure Language in Foundry',
  questions: [
    {
      id: '10-01',
      question:
        'Your app must return the same structured result every time for the same input, such as a language code and confidence score. Which approach fits best?',
      options: [
        'A general-purpose model through the Responses API, because it follows natural language instructions',
        'The chat playground, because it supports follow-up questions',
        'The Azure Language SDK, because its purpose-built analyzers return deterministic, structured output',
        'An image generation model',
      ],
      correctIndex: 2,
      explanation:
        'General-purpose models generate text probabilistically, so wording can vary between calls. Azure Language returns predictable structured values, which suits automated pipelines.',
    },
    {
      id: '10-02',
      question:
        'Which three values does language detection in Azure Language return? Select three.',
      options: [
        'The language name',
        'The ISO 639-1 language code',
        'A confidence score',
        'A Wikipedia URL',
        'Bounding box coordinates',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'detect_language() returns the primary language, its ISO 639-1 code (such as "es") and a confidence score between 0 and 1. Wikipedia links come from entity linking.',
    },
    {
      id: '10-03',
      question: 'What does key phrase extraction in Azure Language do?',
      options: [
        'It detects the language of the text',
        'It identifies the main concepts in the text',
        'It identifies whether the text is positive or negative',
        'It identifies known entities and links them to Wikipedia',
      ],
      correctIndex: 1,
      explanation:
        'Key phrase extraction surfaces the main concepts, which helps with indexing and search. The other options are language detection, sentiment analysis and entity linking.',
    },
    {
      id: '10-04',
      question:
        'A Python app must extract people, locations and organizations from support messages, including the matching text and category. Which client method should it call?',
      options: [
        'recognize_entities()',
        'extract_key_phrases()',
        'analyze_sentiment()',
        'recognize_linked_entities()',
      ],
      correctIndex: 0,
      explanation:
        'Named entity recognition returns entities with categories such as Person, Location and Organization. recognize_linked_entities links entities to a knowledge base like Wikipedia instead.',
    },
    {
      id: '10-05',
      question:
        'Which Azure Language feature returns links to external websites (such as Wikipedia) to disambiguate terms found in text?',
      options: [
        'Key phrase extraction',
        'Language detection',
        'Sentiment analysis',
        'Entity linking (part of entity recognition)',
      ],
      correctIndex: 3,
      explanation:
        'Entity linking identifies known entities together with a link to a knowledge source, so "Mars" the planet can be told apart from the company.',
    },
    {
      id: '10-06',
      question:
        'What does recognize_pii_entities() return for a text that contains a name, phone number and address?',
      options: [
        'Only a list of key phrases',
        'The detected language and confidence score',
        'A redacted version of the text and the entities found, with category and confidence score',
        'A sentiment score per sentence',
      ],
      correctIndex: 2,
      explanation:
        'PII detection identifies personal details (including health information) and can redact them, returning both the redacted text and the entities with their categories.',
    },
    {
      id: '10-07',
      question:
        'A Python app must write a sentiment label and positive, neutral and negative confidence scores for each customer comment, without training a custom model. Which feature should it call?',
      options: [
        'Sentiment analysis',
        'Key phrase extraction',
        'PII detection',
        'Language detection',
      ],
      correctIndex: 0,
      explanation:
        'Sentiment analysis returns a sentiment label with confidence scores for positive, neutral and negative. It is prebuilt, so no custom training is needed.',
    },
    {
      id: '10-08',
      question:
        'What is the purpose of the client object (for example TextAnalyticsClient) in the Azure Language SDK?',
      options: [
        'It stores the user interface settings',
        'It handles authenticated communication between the application code and the Azure Language service',
        'It stores the text that needs to be analyzed',
        'It hosts the language model locally',
      ],
      correctIndex: 1,
      explanation:
        'You create the client with the endpoint and key, then call its methods such as detect_language() or recognize_pii_entities().',
    },
    {
      id: '10-09',
      question:
        'An app reads its configuration from a .env file with load_dotenv() and os.getenv(). The key is stored as API_KEY in the file, but the code calls os.getenv("FOUNDRY_KEY"). What happens?',
      options: [
        'The SDK automatically finds the key under another name',
        'Python raises a syntax error when loading the file',
        'The app uses a default key from the Foundry resource',
        'The value is missing at run time because names in .env must exactly match the names in code',
      ],
      correctIndex: 3,
      explanation:
        'os.getenv() looks up the value by name, so it returns None for a name that is not in the .env file. Keep variable names consistent.',
    },
    {
      id: '10-10',
      question: 'What is the Model Context Protocol (MCP)?',
      options: [
        'An open standard that defines how AI agents connect to external tools and data sources',
        'A Microsoft-only API for training models',
        'A file format for storing embeddings',
        'A protocol for streaming audio to speech services',
      ],
      correctIndex: 0,
      explanation:
        'MCP is like a universal adapter: the agent (MCP client) discovers and invokes tools exposed by an MCP server without custom integration code.',
    },
    {
      id: '10-11',
      question:
        'Which two statements about the Azure Language MCP server are true? Select two.',
      options: [
        'It exposes Azure Language capabilities to agents through MCP',
        'A Foundry resource already includes access to it, so no separate Azure Language resource is needed',
        'It replaces the generative AI model inside the agent',
        'It requires the agent to call the Azure Language REST API directly',
      ],
      correctIndexes: [0, 1],
      explanation:
        'The agent combines the reasoning of its model with the precision of Azure Language through the MCP server, without calling the REST API or managing tokens in agent code.',
    },
    {
      id: '10-12',
      question:
        'Which two tasks are a better fit for Azure Language than for a general-purpose model? Select two.',
      options: [
        'Routing support tickets automatically by detected language',
        'Detecting and redacting PII before storing transcripts',
        'Writing a marketing blog post from a few bullet points',
        'Answering follow-up questions about a review in a conversation',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Automated pipelines that need consistent, structured results suit Azure Language. Free-form writing and conversational follow-ups suit a general-purpose model.',
    },
    {
      id: '10-13',
      question:
        'Which two Azure Language features help identify the issues in support questions and the people and products mentioned in them? Select two.',
      options: [
        'Key phrase extraction',
        'Named entity recognition',
        'Language detection',
        'Speech synthesis',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Key phrases surface the main issues; entity recognition finds people, products and other entities. Language detection only identifies the language.',
    },
  ],
}
