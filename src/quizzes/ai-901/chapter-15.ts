import type { Chapter } from '../types'

// Topics that appear in the official AI-901 practice assessment but are not
// covered in depth by the two learning paths.
export const chapter15: Chapter = {
  id: '15-practice-topics',
  number: 15,
  title: 'Practice assessment topics',
  questions: [
    {
      id: '15-01',
      question:
        'With the Azure Face service, which two features perform one-to-many or one-to-one face matching? Select two.',
      options: [
        'Face identification',
        'Face verification',
        'Face attributes',
        'Custom Vision',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Identification matches a face against a group of people (one-to-many); verification checks whether two faces belong to the same person (one-to-one). Attributes describe a face without matching it.',
    },
    {
      id: '15-02',
      question:
        'Which service should you use to analyze images of people to detect whether specific human-related visual features are present?',
      options: [
        'Azure Vision',
        'Azure Document Intelligence',
        'Azure AI Face',
        'Azure AI Video Indexer',
      ],
      correctIndex: 2,
      explanation:
        'Azure AI Face is designed for face-centric analysis. Azure Vision offers general image analysis, and Video Indexer analyzes video rather than single images.',
    },
    {
      id: '15-03',
      question:
        'Which two specialized domain models does Azure Vision support when categorizing an image? Select two.',
      options: ['Celebrities', 'Landmarks', 'Animals', 'Cars', 'Plants'],
      correctIndexes: [0, 1],
      explanation:
        'The domain-specific models in Azure Vision recognize celebrities and landmarks. There are no built-in domain models for animals, cars or plants.',
    },
    {
      id: '15-04',
      question:
        'Which service provides a platform for building conversational AI (bots)?',
      options: [
        'Azure AI Bot Service',
        'Azure Translator',
        'Azure Vision',
        'Azure Document Intelligence',
      ],
      correctIndex: 0,
      explanation:
        'Azure AI Bot Service is the platform for conversational AI. Translator translates text; Vision and Document Intelligence analyze images and documents.',
    },
    {
      id: '15-05',
      question:
        'What are the two main schema components of a conversational language understanding model? Select two.',
      options: ['Intents', 'Entities', 'Utterances', 'Entity linking'],
      correctIndexes: [0, 1],
      explanation:
        'Intents represent what the user wants to do and entities are the items the intent applies to. Utterances are example inputs used for training, not schema components.',
    },
    {
      id: '15-06',
      question:
        'Which AI workload has the primary purpose of making large amounts of data searchable?',
      options: [
        'Object detection',
        'Semantic segmentation',
        'Image analysis',
        'Knowledge mining',
      ],
      correctIndex: 3,
      explanation:
        'Knowledge mining extracts information from large volumes of (often unstructured) data to create a searchable store.',
    },
    {
      id: '15-07',
      question:
        'According to the NIST AI Risk Management Framework, what is the first stage when developing a responsible generative AI solution?',
      options: [
        'Identify potential harms',
        'Measure the presence of potential harms',
        'Mitigate potential harms',
        'Operate the solution',
      ],
      correctIndex: 0,
      explanation:
        'You first identify potential harms, then measure them, mitigate them, and finally operate the solution responsibly.',
    },
    {
      id: '15-08',
      question:
        'Which responsible AI principle ensures that an AI system meets the legal and ethical standards it must abide by?',
      options: [
        'Fairness',
        'Accountability',
        'Inclusiveness',
        'Privacy and security',
      ],
      correctIndex: 1,
      explanation:
        'Accountability makes the people and organizations behind AI answerable for it, with governance to meet legal and ethical standards.',
    },
    {
      id: '15-09',
      question:
        'Which responsible AI principle aims to ensure that AI solutions benefit all parts of society, regardless of gender or ethnicity?',
      options: [
        'Reliability and safety',
        'Accountability',
        'Inclusiveness',
        'Privacy and security',
      ],
      correctIndex: 2,
      explanation:
        'Inclusiveness is about empowering everyone and not excluding groups of users.',
    },
    {
      id: '15-10',
      question:
        'You must ensure that users understand the purpose of a generative AI solution and the potential impact of its outputs. Which risk should you identify and mitigate?',
      options: [
        'Adversarial vulnerability',
        'Bias or unfair outcomes',
        'Lack of accessibility',
        'Lack of transparency',
      ],
      correctIndex: 3,
      explanation:
        'Making clear how and why the system is used and what its outputs represent is transparency. Bias relates to fairness and accessibility to inclusiveness.',
    },
    {
      id: '15-11',
      question:
        'Which two responsible AI principles are most important when designing an AI system that manages healthcare data? Select two.',
      options: [
        'Accountability',
        'Privacy and security',
        'Fairness',
        'Inclusiveness',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Sensitive health data demands strong protection (privacy and security) and clear responsibility for how the system handles it (accountability).',
    },
    {
      id: '15-12',
      question:
        'Which two scenarios are common use cases for generative AI? Select two.',
      options: [
        'Summarization',
        'Image generation',
        'Anomaly detection',
        'Predictive maintenance alarms based on fixed thresholds',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Both produce new content. Anomaly detection and threshold-based alerts identify patterns in data, which is traditional machine learning or rule-based logic.',
    },
    {
      id: '15-13',
      question:
        'Which AI technique extracts the name of a store from a photograph of its storefront?',
      options: [
        'Image classification',
        'Semantic segmentation',
        'Natural language processing',
        'Optical character recognition (OCR)',
      ],
      correctIndex: 3,
      explanation:
        'Reading text that appears in an image is OCR. Image classification would only label the photo, for example as "storefront".',
    },
    {
      id: '15-14',
      question:
        'For which two scenarios is the Universal Language Model used by the speech-to-text API optimized? Select two.',
      options: ['Conversational', 'Dictation', 'Acoustic', 'Pronunciation'],
      correctIndexes: [0, 1],
      explanation:
        'The universal model is optimized for conversational and dictation scenarios. Custom models can adapt the acoustic and language models for specific environments or vocabulary.',
    },
    {
      id: '15-15',
      question:
        'Which two file types can be imported to create a knowledge base for an agent? Select two.',
      options: ['PDF', 'DOC', 'MP4', 'ZIP'],
      correctIndexes: [0, 1],
      explanation:
        'Text documents such as PDF and Word files can be ingested and indexed as knowledge. Video files and archives are not supported as document knowledge.',
    },
  ],
}
