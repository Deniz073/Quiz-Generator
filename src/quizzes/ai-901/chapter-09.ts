import type { Chapter } from '../types'

export const chapter09: Chapter = {
  id: '9-foundry-models-agents',
  number: 9,
  title: 'Generative AI models and agents in Foundry',
  questions: [
    {
      id: '9-01',
      question: "What best describes Foundry's model catalog?",
      options: [
        'A catalog of only Microsoft-exclusive models',
        'A central hub to discover, filter, compare and test generative AI models from many providers',
        'A tool that removes the need for an Azure subscription',
        'A library of pre-generated images and videos',
      ],
      correctIndex: 1,
      explanation:
        'The catalog contains models sold directly by Azure and models from partners and the community, with filters (for example by inference task), benchmarks and model cards.',
    },
    {
      id: '9-02',
      question:
        'Which statement describes a foundation model in Microsoft Foundry?',
      options: [
        'A large, pretrained model with general capabilities that can be used immediately or customized',
        'A small, task-specific model that must be fine-tuned before it does anything useful',
        'A benchmarking tool that compares model families',
        'The base Azure resource that hosts a project',
      ],
      correctIndex: 0,
      explanation:
        'Foundation models (GPT, Claude, Mistral and others) provide language, reasoning or multimodal capabilities out of the box and can be deployed directly or fine-tuned.',
    },
    {
      id: '9-03',
      question:
        'What characterizes the models in the catalog that are sold directly by Azure?',
      options: [
        'They are open source and community supported only',
        'They cannot be deployed to production',
        'They are hosted by Microsoft, with enterprise-grade SLAs and Azure integration',
        'They only support image generation',
      ],
      correctIndex: 2,
      explanation:
        'Models sold directly by Azure are hosted by Microsoft under Microsoft Product Terms. Partner and community models support broader experimentation and specialized tasks.',
    },
    {
      id: '9-04',
      question:
        'You want to evaluate model output quality beyond traditional metrics. Which two are AI-assisted quality metrics? Select two.',
      options: ['Groundedness', 'Coherence', 'Precision', 'Recall', 'F1 score'],
      correctIndexes: [0, 1],
      explanation:
        'AI-assisted metrics include groundedness, relevance, coherence, fluency and similarity. Accuracy, precision, recall and F1 are classic NLP metrics.',
    },
    {
      id: '9-05',
      question:
        'A safety evaluator in Foundry finds harmful content in model output. What does the evaluator do with it?',
      options: [
        'It automatically rewrites the output',
        'It retrains the model to avoid the content',
        'It blocks the deployment',
        'It detects and scores the issue, but does not resolve it',
      ],
      correctIndex: 3,
      explanation:
        'Evaluators measure quality, safety and effectiveness; on their own they detect, scan and score issues but do not actively fix them.',
    },
    {
      id: '9-06',
      question:
        'You need to deploy an Azure OpenAI model for a chat app and apply guardrails. Which deployment option should you use?',
      options: [
        'Standard deployment in Foundry resources',
        'Managed compute deployment',
        'Instant access without a deployment',
        'A provisioned throughput reservation only',
      ],
      correctIndex: 0,
      explanation:
        'A standard deployment creates an actual deployment that can be governed with guardrails. Managed compute is for partner and community models, and instant access does not create a deployment.',
    },
    {
      id: '9-07',
      question:
        'Your deployment returns rate-limit errors under load. Which changes reduce throttling? Select two.',
      options: [
        'Lower the max output tokens setting',
        'Reduce the number of concurrent requests',
        'Increase the temperature',
        'Add more examples to every prompt',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Larger prompts and higher max output tokens consume more of the tokens-per-minute (TPM) quota. Lowering max tokens or concurrency keeps you within the limit; temperature does not affect token usage.',
    },
    {
      id: '9-08',
      question:
        'Which three things happen when you deploy a model in Foundry? Select three.',
      options: [
        'Compute resources are allocated',
        'An API endpoint is created',
        'Monitoring and logging become active',
        'The model is retrained on your own data',
        'The model weights are downloaded to every client device',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'Deployment allocates compute, creates a secure endpoint, locks in the configuration and turns on monitoring. It does not retrain the model.',
    },
    {
      id: '9-09',
      question: 'Which model parameter controls creativity versus determinism?',
      options: [
        'Max output tokens',
        'Temperature',
        'Tokens per minute',
        'Model version',
      ],
      correctIndex: 1,
      explanation:
        'Temperature controls how random or deterministic responses are. Max output tokens caps response length.',
    },
    {
      id: '9-10',
      question:
        'You want to submit prompts to a deployed model and review the responses without writing code. Which Foundry portal feature should you use?',
      options: [
        'The model catalog',
        'Models + endpoints',
        'The chat playground',
        'Monitoring metrics',
      ],
      correctIndex: 2,
      explanation:
        'The playground lets you test prompts, compare models and capture working settings that you can reuse in code. The catalog is for finding models.',
    },
    {
      id: '9-11',
      question:
        'A Python chat app uses an OpenAI-compatible client from a Foundry project. Which method sends a prompt through the Responses API?',
      options: [
        'models.list()',
        'deployments.get()',
        'chat.completions.create()',
        'responses.create()',
      ],
      correctIndex: 3,
      explanation:
        'responses.create() calls the Responses API. chat.completions.create() uses the older Chat Completions API, and deployments.get() and models.list() only return metadata.',
    },
    {
      id: '9-12',
      question:
        'After creating an AIProjectClient for a Foundry project, what should a Python chat app do before it sends prompts to a deployed model?',
      options: [
        'Call get_openai_client() to get an authenticated OpenAI-compatible client',
        'Use the deployment URL as the project endpoint',
        'Send prompts through the deployments operations',
        'Create a client from the deployment name only',
      ],
      correctIndex: 0,
      explanation:
        'project_client.get_openai_client() returns the client used for model requests. AIProjectClient uses the project endpoint, and deployment operations only manage metadata.',
    },
    {
      id: '9-13',
      question:
        'Which three components does an agent in Microsoft Foundry bring together? Select three.',
      options: [
        'A model for reasoning',
        'Instructions that define its role and behavior',
        'Tools for the actions it can take',
        'A dedicated Azure subscription',
        'A custom tokenizer',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'An agent packages a model, instructions (system prompt) and tools. Note that the instructions, not the model choice, define how the agent behaves.',
    },
    {
      id: '9-14',
      question:
        'A Python app must send a user message to an existing prompt agent named faq-agent in a Foundry project. What should it do?',
      options: [
        'Call responses.create() with model set to "faq-agent"',
        'Call responses.create() with an agent_reference to the agent',
        'Create an ephemeral agent in the app',
        'Generate embeddings for the user message',
      ],
      correctIndex: 1,
      explanation:
        'Passing an agent reference sends the message to the existing agent definition. Setting model to the agent name treats it as a model deployment, which it is not.',
    },
    {
      id: '9-15',
      question:
        'Which two statements about tools for Foundry agents are true? Select two.',
      options: [
        'You can discover, configure and add tools to an agent through the Foundry tool catalog',
        'Built-in tools can be enabled without hosting external code',
        'Built-in tools require you to host external code first',
        'Adding tools changes the training data of the model',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Tools (such as Code Interpreter, knowledge sources, custom functions or MCP servers) let the model take actions. Built-in tools are preconfigured; tools do not change model training.',
    },
    {
      id: '9-16',
      question:
        'An agent answers a policy question using knowledge connected in Foundry. What does the response include so the user can verify it?',
      options: [
        'The raw embedding vectors',
        'The system prompt',
        'A citation to the knowledge source used',
        'The tokens-per-minute usage',
      ],
      correctIndex: 2,
      explanation:
        'Tools are actions and knowledge is context: when knowledge is used through RAG, the response cites the knowledge store, which makes answers traceable.',
    },
  ],
}
