import type { Chapter } from '#/quizzes/types'

export const chapter02: Chapter = {
  id: '2-generative-ai',
  number: 2,
  title: 'Generative AI, language models and prompts',
  questions: [
    {
      id: '2-01',
      question:
        'What happens during tokenization when a language model is trained?',
      options: [
        'Words are sorted alphabetically so they can be looked up faster',
        'Text is converted to binary code for the processor',
        'The training text is broken into tokens (words, sub-words, punctuation) and each distinct token gets a unique ID',
        'Stop words are translated into a common language',
      ],
      correctIndex: 2,
      explanation:
        'Tokenization breaks text into smaller units such as words, sub-words like "un", and punctuation, and assigns each distinct token an integer ID. It has nothing to do with sorting or binary encoding.',
    },
    {
      id: '2-02',
      question: 'What are embeddings in a language model?',
      options: [
        'Extra words that the transformer adds to make output longer',
        'Vectors that represent tokens and capture their semantic meaning and context',
        'Small language models embedded in a larger model',
        'The system prompt that is embedded in every request',
      ],
      correctIndex: 1,
      explanation:
        'Embeddings are vector representations of tokens with linguistic and semantic characteristics embedded in them. Tokens used in similar contexts get vectors that point in similar directions.',
    },
    {
      id: '2-03',
      question: 'What does an attention layer do in a transformer model?',
      options: [
        'It examines each token and determines how it is influenced by the tokens around it',
        'It removes irrelevant words from the input text',
        'It flags inappropriate content in the generated output',
        'It compresses the vocabulary to reduce model size',
      ],
      correctIndex: 0,
      explanation:
        'Attention weights the surrounding tokens by their influence on the current token (for "bark", the words "heard" and "dog" weigh more than "I" or "a"). Content filtering is a separate safety mechanism.',
    },
    {
      id: '2-04',
      question:
        'In a transformer, which block uses the embeddings to predict the next most probable token in a sequence that a prompt started?',
      options: [
        'The encoder block',
        'The tokenizer',
        'The positional encoder',
        'The decoder block',
      ],
      correctIndex: 3,
      explanation:
        'The encoder creates the embeddings; the decoder uses them (with attention and a feed-forward network) to predict the next token, repeating until the sequence ends.',
    },
    {
      id: '2-05',
      question:
        'Why are token vectors fed into a transformer together with a positional encoding?',
      options: [
        'To reduce the number of tokens in the vocabulary',
        'To indicate where each token appears in the sequence, because word order affects meaning',
        'To mark which tokens are stop words',
        'To encrypt the training data',
      ],
      correctIndex: 1,
      explanation:
        'The order in which tokens appear is relevant to how they relate to each other, so a positional encoding is added to each token vector.',
    },
    {
      id: '2-06',
      question:
        'During decoder training, the model ignores the tokens that come after the current token. What is this technique called?',
      options: [
        'Multi-head attention',
        'Stop word removal',
        'Masked attention',
        'Positional encoding',
      ],
      correctIndex: 2,
      explanation:
        'Masked attention hides later tokens so the model must predict them; the prediction is compared to the known next token to adjust the weights. Multi-head attention evaluates several vector elements in parallel.',
    },
    {
      id: '2-07',
      question:
        'How can you measure how semantically close two tokens are, using their embeddings?',
      options: [
        'Compare their token IDs',
        'Count how often they appear in the training data',
        'Compare the length of the words',
        'Calculate the cosine similarity of their vectors',
      ],
      correctIndex: 3,
      explanation:
        'Semantically similar tokens have vectors pointing in similar directions, which cosine similarity measures. Token IDs are arbitrary integers and say nothing about meaning.',
    },
    {
      id: '2-08',
      question: 'What is the purpose of a system prompt?',
      options: [
        'To set the behavior, tone and constraints that the model must follow in its responses',
        'To configure the model to run on a specific operating system',
        'To store user preferences permanently in the model',
        'To change the training data of the model',
      ],
      correctIndex: 0,
      explanation:
        'A system prompt (system message) guides the role, style and boundaries of the model. It does not change training data and does not replace safety controls.',
    },
    {
      id: '2-09',
      question:
        'A user asks a follow-up question in a chat app, and the model answers in the context of the earlier conversation. How do generative AI apps typically achieve this?',
      options: [
        'The model is retrained after every message',
        'The app includes (a summary of) the conversation history in subsequent prompts',
        'The model stores every conversation in its embeddings',
        'The system prompt is replaced by the previous answer',
      ],
      correctIndex: 1,
      explanation:
        'Apps keep track of the conversation history and send it along with new prompts, giving the model ongoing context. Models are not retrained per conversation.',
    },
    {
      id: '2-10',
      question:
        'An expenses assistant first retrieves relevant sections of the company expenses policy and adds them to the prompt before calling the model. What is this technique called?',
      options: [
        'Fine-tuning',
        'Tokenization',
        'Retrieval augmented generation (RAG)',
        'Prompt shielding',
      ],
      correctIndex: 2,
      explanation:
        'RAG retrieves relevant information and uses it to augment the prompt, so the response is grounded in that data. Fine-tuning would change the model itself.',
    },
    {
      id: '2-11',
      question:
        'Which three practices help you get better results from a generative AI model? Select three.',
      options: [
        'Be clear and specific in your instructions',
        'Add context, such as the topic, audience or desired format',
        'Provide an example of the style you want',
        'Keep the prompt vague so the model can be creative',
        'Leave out any requested output format such as bullets or tables',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'Clear instructions, context (audience, format), examples and requesting structure all improve responses. A prompt for structured output should state the format, not omit it.',
    },
    {
      id: '2-12',
      question:
        'An agent sends emails and updates calendars on behalf of a user. Which kind of tool is it using?',
      options: [
        'A knowledge tool',
        'An action tool',
        'An embedding tool',
        'A tokenizer',
      ],
      correctIndex: 1,
      explanation:
        'Action tools let an agent perform tasks such as sending email or controlling devices. Knowledge tools give access to information, such as search engines or databases.',
    },
    {
      id: '2-13',
      question: 'What characterizes a multi-agent system?',
      options: [
        'One agent uses several models at the same time',
        'Several users share one agent',
        'Multiple specialized agents collaborate, communicating through prompts to split up the work',
        'An agent is copied to several regions for high availability',
      ],
      correctIndex: 2,
      explanation:
        'In a multi-agent system each agent has its own specialty (gather data, analyze it, take action) and they collaborate like a human team, communicating through prompts.',
    },
    {
      id: '2-14',
      question:
        'Which statement describes a key feature of a generative AI model?',
      options: [
        'It follows predefined rules to make deterministic decisions',
        'It identifies anomalies in large volumes of structured data',
        'It assigns labels to data by using classification logic only',
        'It produces original output based on patterns learned from training data',
      ],
      correctIndex: 3,
      explanation:
        'Generative AI creates new content from learned patterns. Rule-based decisions, anomaly detection and pure classification are traditional software or machine learning workloads.',
    },
    {
      id: '2-15',
      question:
        'Which two capabilities are examples of what a GPT model can do? Select two.',
      options: [
        'Understand natural language',
        'Create natural language',
        'Synthesize speech audio',
        'Generate real-time closed captions from a video stream',
      ],
      correctIndexes: [0, 1],
      explanation:
        'GPT models understand and generate natural language. Speech synthesis and live captioning are speech workloads handled by speech services.',
    },
  ],
}
