import type { Chapter } from '#/quizzes/types'

export const chapter03: Chapter = {
  id: '3-text-analysis',
  number: 3,
  title: 'Text analysis techniques',
  questions: [
    {
      id: '3-01',
      question:
        'In text analysis, what is the term for the body of text that is being analyzed?',
      options: ['A corpus', 'A lexicon', 'A schema', 'An embedding'],
      correctIndex: 0,
      explanation:
        'The body of text being analyzed is called a corpus; the first step is to break it into tokens. A lexicon is a pronunciation or word dictionary.',
    },
    {
      id: '3-02',
      question:
        'Which pre-processing technique excludes words such as "the", "a" and "it" because they add little semantic meaning?',
      options: [
        'Lemmatization',
        'N-gram extraction',
        'Stop word removal',
        'Parts of speech tagging',
      ],
      correctIndex: 2,
      explanation:
        'Stop word removal drops common words so the analysis can focus on the important ones. In the statistical analysis of terms this is typically the first step.',
    },
    {
      id: '3-03',
      question:
        'Which technique reduces words like "powering", "powered" and "powerful" to the same token by stripping word endings before counting them?',
      options: ['Stemming', 'Vectorization', 'TextRank', 'Text classification'],
      correctIndex: 0,
      explanation:
        'Stemming normalizes words by chopping off endings so related words are counted as one. Vectorization turns tokens into numeric vectors.',
    },
    {
      id: '3-04',
      question: 'How does lemmatization differ from stemming?',
      options: [
        'Lemmatization only works on nouns',
        'Lemmatization uses linguistic rules and vocabulary so the result is a valid dictionary word',
        'Lemmatization removes stop words, while stemming does not',
        'Lemmatization groups words into multi-word phrases',
      ],
      correctIndex: 1,
      explanation:
        'Stemming simply chops off endings; lemmatization reduces a word to its dictionary form (lemma), such as "running" to "run". Grouping phrases is n-gram extraction.',
    },
    {
      id: '3-05',
      question:
        'What do you call a two-word phrase such as "artificial intelligence" when extracting n-grams?',
      options: ['A unigram', 'A trigram', 'A lemma', 'A bigram'],
      correctIndex: 3,
      explanation:
        'A single word is a unigram, two words a bigram, three a trigram. Treating frequent word sequences as groups helps the algorithm make sense of the text.',
    },
    {
      id: '3-06',
      question:
        'Which technique identifies the words that are most relevant to one document compared with the rest of a collection of documents?',
      options: [
        'Simple frequency analysis',
        'Naive Bayes',
        'Term Frequency - Inverse Document Frequency (TF-IDF)',
        'Word2Vec',
      ],
      correctIndex: 2,
      explanation:
        'TF-IDF scores a term high when it appears often in one document but rarely across the others. Simple frequency counts cannot discriminate between documents that share the same common words.',
    },
    {
      id: '3-07',
      question:
        'The word "agent" appears in every document of a corpus. What is its TF-IDF score in each document?',
      options: [
        'Zero, because log(N / df) = log(1) = 0',
        'The same as its term frequency',
        'The highest score in the corpus',
        'It cannot be calculated',
      ],
      correctIndex: 0,
      explanation:
        'When a term appears in all N documents, its IDF is log(N/N) = 0, so the term carries no discriminative weight regardless of how often it appears.',
    },
    {
      id: '3-08',
      question:
        'Which statement describes the bag-of-words technique, used for example with a Naive Bayes spam filter?',
      options: [
        'It summarizes text by ranking sentences in a graph',
        'It represents text as a vector of word frequencies or occurrences, ignoring grammar and word order',
        'It encodes words as contextual embeddings using attention',
        'It tags every token with its grammatical category',
      ],
      correctIndex: 1,
      explanation:
        'Bag-of-words is a feature extraction technique based on word counts; a classifier such as Naive Bayes then predicts the class (spam, positive, negative). Ranking sentences in a graph is TextRank.',
    },
    {
      id: '3-09',
      question:
        'TextRank selects the sentences that are most similar to many other important sentences to form a summary. What kind of summarization is this?',
      options: [
        'Abstractive summarization',
        'Generative summarization',
        'Extractive summarization',
        'Semantic segmentation',
      ],
      correctIndex: 2,
      explanation:
        'Extractive summarization builds the summary from a subset of the original sentences; no new text is generated. Abstractive summarization generates new language.',
    },
    {
      id: '3-10',
      question:
        'Which NLP technique assigns numeric values to words so that "plant" and "flower" are considered closer to each other than "airplane"?',
      options: [
        'Frequency analysis',
        'N-grams',
        'Lemmatization',
        'Vectorization (embeddings)',
      ],
      correctIndex: 3,
      explanation:
        'Vectorization represents words as vectors whose direction reflects meaning, so semantically related words end up close together. Frequency analysis only counts occurrences.',
    },
    {
      id: '3-11',
      question:
        'Using word embeddings, which calculation answers the analogy "puppy is to dog as kitten is to ?"',
      options: [
        'kitten - puppy + dog',
        'kitten + puppy + dog',
        'dog - kitten + puppy',
        'puppy - dog - kitten',
      ],
      correctIndex: 0,
      explanation:
        'kitten - puppy removes the "kitten-ness vs puppy-ness" difference; adding dog lands near cat. In practice you look for the word whose vector is closest to the result.',
    },
    {
      id: '3-12',
      question:
        'Which two techniques are applied to prepare text before or during tokenization? Select two.',
      options: [
        'Text normalization (lowercasing, removing punctuation)',
        'Stop word removal',
        'Cosine similarity',
        'Beam search decoding',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Normalization and stop word removal are pre-processing steps. Cosine similarity compares vectors afterwards, and beam search is a decoding step in speech recognition.',
    },
    {
      id: '3-13',
      question:
        'What is a possible downside of normalizing text by lowercasing it and removing punctuation?',
      options: [
        'It makes word frequency analysis slower',
        'It doubles the number of tokens',
        'Some semantic meaning can be lost, for example the difference between "Mr Banks" and "banks"',
        'It prevents stop word removal',
      ],
      correctIndex: 2,
      explanation:
        'Normalization helps frequency-based analysis, but it can erase useful distinctions such as a proper name versus a common noun, or a period that marks the end of a sentence.',
    },
    {
      id: '3-14',
      question:
        'Which two text analysis workloads are examples of natural language processing (NLP)? Select two.',
      options: [
        'Performing sentiment analysis on social media posts',
        'Translating product reviews between languages',
        'Generating tags and descriptions for images',
        'Monitoring network traffic for sudden spikes',
        'Extracting handwritten text from scanned images',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Sentiment analysis and translation work on language. Image tagging and handwriting extraction (OCR) are computer vision; spotting traffic spikes is anomaly detection.',
    },
  ],
}
