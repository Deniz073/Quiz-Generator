import type { Chapter } from '../types'

export const chapter07: Chapter = {
  id: '7-rag',
  number: 7,
  title: 'Retrieval-augmented generation (RAG)',
  questions: [
    {
      id: '7-01',
      question:
        'What is the main purpose of retrieval-augmented generation (RAG)?',
      options: [
        'To retrain the language model whenever source information changes',
        'To replace the language model with a search engine',
        'To ground generated responses in relevant information retrieved from a data source',
        'To reduce the number of tokens in the model vocabulary',
      ],
      correctIndex: 2,
      explanation:
        'RAG retrieves relevant information and adds it to the prompt so the model generates a grounded response. It does not retrain the model or replace it.',
    },
    {
      id: '7-02',
      question:
        'Which three limitations of language models does RAG help address? Select three.',
      options: [
        'The model does not know private information such as internal policies',
        'Information learned during training can become outdated',
        'The model can give confident answers that are not supported by a reliable source',
        'The model cannot generate fluent text',
        'The model cannot process prompts in English',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'RAG addresses knowledge boundaries, freshness and verifiability. Fluency is already a strength of language models.',
    },
    {
      id: '7-03',
      question:
        "A company's expense policy changes. What must happen so a RAG-based assistant gives the new answers?",
      options: [
        'Update the source documents and the search index',
        'Retrain the language model',
        'Increase the temperature of the model',
        'Deploy a larger model',
      ],
      correctIndex: 0,
      explanation:
        "RAG supplies knowledge at run time and doesn't change the model's learned parameters, so updating the documents and index is enough.",
    },
    {
      id: '7-04',
      question:
        'Why are large documents commonly divided into chunks before indexing?',
      options: [
        'So each chunk can train a separate language model',
        'So the solution can retrieve focused passages that fit efficiently into a prompt',
        'So the original documents no longer need to be stored',
        'So keyword search is no longer needed',
      ],
      correctIndex: 1,
      explanation:
        'A question about hotel limits can retrieve only the hotel section instead of the whole travel policy. Chunks often overlap slightly so context is not lost at a boundary.',
    },
    {
      id: '7-05',
      question: 'What is a risk of making chunks too small?',
      options: [
        'They consume too much of the context window',
        'They include too much irrelevant information',
        'They make embeddings impossible to calculate',
        'A statement can be separated from the headings or definitions needed to understand it',
      ],
      correctIndex: 3,
      explanation:
        'Chunks that are too small lose context; chunks that are too large contain irrelevant information and use more of the context window.',
    },
    {
      id: '7-06',
      question: 'What does an embedding represent in a RAG solution?',
      options: [
        'A numerical vector that captures semantic characteristics of a chunk of content',
        'The system instructions that define model behavior',
        'The final answer returned to the user',
        'A citation link to a source document',
      ],
      correctIndex: 0,
      explanation:
        'An embedding model converts each chunk into a vector; chunks with similar meanings end up close together in vector space, even when they use different words.',
    },
    {
      id: '7-07',
      question:
        "A user asks about 'business trip expenses' and the system finds a passage about 'company travel costs'. Which search approach makes this possible?",
      options: [
        'Exact filename matching',
        'Keyword search',
        'Semantic vector search',
        'Random document selection',
      ],
      correctIndex: 2,
      explanation:
        'Vector search compares meaning, not exact words. Keyword search is better when exact identifiers or product codes matter.',
    },
    {
      id: '7-08',
      question:
        'Users search a support knowledge base by product codes such as "XR-2045" and also by descriptive questions. Which search approach fits best?',
      options: [
        'Vector search only',
        'Hybrid search that combines keyword and vector search',
        'Keyword search only',
        'No search; send all documents in the prompt',
      ],
      correctIndex: 1,
      explanation:
        'Keyword search handles exact identifiers; vector search handles meaning. Hybrid search combines both.',
    },
    {
      id: '7-09',
      question:
        'At run time, how is a user query prepared for vector search in a RAG application?',
      options: [
        'It is converted to a vector with the same kind of embedding model used during indexing',
        'It is translated into SQL',
        'It is sent to the language model to generate the answer first',
        'It is split into chunks with overlap',
      ],
      correctIndex: 0,
      explanation:
        'The query must live in the same vector space as the stored chunks, so it is embedded with the same kind of model before the closest matches are retrieved.',
    },
    {
      id: '7-10',
      question:
        'Why should retrieved document content be treated as data rather than as instructions in the augmented prompt?',
      options: [
        'Because documents are always outdated',
        'Because retrieved content could contain text that tries to redirect the model',
        'Because the model cannot read retrieved content otherwise',
        'Because citations only work for instructions',
      ],
      correctIndex: 1,
      explanation:
        'Source content could include injected instructions, so the prompt must distinguish trusted application instructions from retrieved data.',
    },
    {
      id: '7-11',
      question:
        'A RAG response is fluent but states an incorrect policy limit. What should you examine first?',
      options: [
        'Whether the model can produce a longer response',
        'Whether more unrelated documents can be added to the prompt',
        'Whether the correct and current policy passage was retrieved and supplied as context',
        'Whether the temperature is high enough',
      ],
      correctIndex: 2,
      explanation:
        "If the right information isn't retrieved, changing the generation prompt won't fix it. Check retrieval first, then how the model used the context.",
    },
    {
      id: '7-12',
      question:
        'Which two criteria evaluate the retrieval part of a RAG solution rather than the generated answer? Select two.',
      options: [
        'Coverage: is all information needed for a complete answer present?',
        'Ranking: are the strongest results placed ahead of weaker ones?',
        'Groundedness: is each claim supported by the retrieved content?',
        'Citation quality: do citations point to supporting sources?',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Retrieval evaluation covers relevance, coverage, ranking, security and freshness. Groundedness and citation quality evaluate the generated response.',
    },
    {
      id: '7-13',
      question:
        'What is a trade-off of retrieving and adding more chunks to every prompt?',
      options: [
        'It always improves answer quality without downsides',
        'It removes the need for citations',
        'It reduces latency because the model has more context',
        'It increases prompt size, response time and cost, and can make it harder for the model to focus',
      ],
      correctIndex: 3,
      explanation:
        'More context can improve coverage, but RAG design balances quality against latency and cost. The goal is the smallest set of content that is sufficient.',
    },
  ],
}
