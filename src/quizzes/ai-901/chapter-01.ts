import type { Chapter } from '../types'

export const chapter01: Chapter = {
  id: '1-ai-workloads',
  number: 1,
  title: 'AI workloads and responsible AI',
  questions: [
    {
      id: '1-01',
      question: 'Which statement best describes generative AI?',
      options: [
        'An older form of AI that has been superseded by machine learning',
        'AI that uses a language model to create original content, such as text, images or code, in response to a prompt',
        'AI that can only classify existing data into predefined categories',
        'A specialist form of AI that only data scientists can use',
      ],
      correctIndex: 1,
      explanation:
        'Generative AI creates new content (natural language, images, video, code) based on prompts. It is not limited to classifying existing data, and it is not reserved for specialists.',
    },
    {
      id: '1-02',
      question:
        'Which three elements make up an AI agent according to the Microsoft AI fundamentals material? Select three.',
      options: [
        'A large language model that provides language understanding and reasoning',
        'Instructions (a system prompt) that define the role and behavior of the agent',
        'Tools that let the agent access information or perform actions',
        'A labeled training dataset that the agent retrains on during every conversation',
        'A dedicated GPU cluster provisioned per user',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'An agent combines a model (its "brain"), instructions (its job description) and tools (knowledge and action tools). Agents do not retrain on each conversation.',
    },
    {
      id: '1-03',
      question:
        'When is a small language model (SLM) typically a better fit than a large language model (LLM)?',
      options: [
        'When the scenario needs the broadest possible general knowledge',
        'When the model must generate images as well as text',
        'When the scenario is focused on a specific topic area or needs a small model deployed locally on a device',
        'When the model must be trained on the largest possible volume of data',
      ],
      correctIndex: 2,
      explanation:
        'SLMs work well for focused topic areas and for small, easily deployed models on devices. LLMs generalize better but are more costly to train and use.',
    },
    {
      id: '1-04',
      question:
        'A company wants to know whether product reviews are positive, negative or neutral. Which text analysis technique should it use?',
      options: [
        'Language detection',
        'Entity detection',
        'Summarization',
        'Sentiment analysis',
      ],
      correctIndex: 3,
      explanation:
        'Sentiment analysis is a form of text classification that labels text as positive, negative or neutral. Entity detection finds people, places and organizations, not opinion.',
    },
    {
      id: '1-05',
      question:
        'An AI application reads incoming email aloud to a user. Which speech capability is being used?',
      options: [
        'Speech synthesis',
        'Speech recognition',
        'Sentiment analysis',
        'Optical character recognition',
      ],
      correctIndex: 0,
      explanation:
        'Speech synthesis (text-to-speech) vocalizes text. Speech recognition is the reverse: it transcribes spoken audio into text.',
    },
    {
      id: '1-06',
      question:
        'Which computer vision technique identifies the individual pixels in an image that belong to a particular object?',
      options: [
        'Image classification',
        'Object detection',
        'Semantic segmentation',
        'Optical character recognition',
      ],
      correctIndex: 2,
      explanation:
        'Semantic segmentation classifies individual pixels per object. Object detection only indicates location with a bounding box, and image classification predicts one label for the whole image.',
    },
    {
      id: '1-07',
      question:
        'Which computer vision technology is the basis for most document analysis and information extraction solutions?',
      options: [
        'Optical character recognition (OCR)',
        'Speech synthesis',
        'Semantic segmentation',
        'Diffusion',
      ],
      correctIndex: 0,
      explanation:
        'OCR locates and reads text in images, and is usually combined with a model that maps the text to specific fields. Diffusion is an image generation technique.',
    },
    {
      id: '1-08',
      question:
        'A robot uses computer vision to detect objects and only acts when its confidence in the identification is above a threshold. Which responsible AI principle does this support?',
      options: [
        'Transparency',
        'Inclusiveness',
        'Accountability',
        'Reliability and safety',
      ],
      correctIndex: 3,
      explanation:
        'AI is probabilistic and not infallible, so avoiding action at low confidence mitigates the risk of harm: reliability and safety. Transparency is about informing users how the system works.',
    },
    {
      id: '1-09',
      question:
        'A bank discloses that its loan-approval application uses AI and describes the features of the data it was trained on. Which responsible AI principle is this?',
      options: [
        'Fairness',
        'Transparency',
        'Privacy and security',
        'Inclusiveness',
      ],
      correctIndex: 1,
      explanation:
        'Making users aware of how a system works and its limitations is transparency. Fairness would be testing that the system does not discriminate.',
    },
    {
      id: '1-10',
      question:
        'An AI agent that offers speech-based interaction also generates text captions so that users with a hearing impairment can use it. Which responsible AI principle does this support?',
      options: [
        'Accountability',
        'Reliability and safety',
        'Inclusiveness',
        'Fairness',
      ],
      correctIndex: 2,
      explanation:
        'Inclusiveness means AI solutions should not exclude some users. Fairness is about avoiding biased or discriminatory outcomes, not about access for people with disabilities.',
    },
    {
      id: '1-11',
      question:
        'An airport uses facial identification for temporary access to a secure area. Which two measures support the privacy and security principle? Select two.',
      options: [
        'Delete the personal images as soon as they are no longer required',
        'Prevent operators who have no need to view the images from accessing them',
        'Publish a description of how the model works on the airport website',
        'Test the system for equal accuracy across demographic groups',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Deleting data that is no longer needed and restricting access to it protect personal data. Publishing how the model works is transparency, and testing across groups is fairness.',
    },
    {
      id: '1-12',
      question:
        'Which responsible AI principle requires organizations to define and apply a governance framework, because people remain answerable for what their AI systems do?',
      options: ['Accountability', 'Transparency', 'Fairness', 'Inclusiveness'],
      correctIndex: 0,
      explanation:
        'Accountability: the people and organizations that build and distribute AI are accountable for it, which calls for a governance framework. Transparency covers explaining how the system works.',
    },
    {
      id: '1-13',
      question:
        'An AI-powered college admissions system is tested to make sure it evaluates applications on relevant academic criteria and not on irrelevant demographic factors. Which principle is being applied?',
      options: [
        'Reliability and safety',
        'Privacy and security',
        'Accountability',
        'Fairness',
      ],
      correctIndex: 3,
      explanation:
        'Fairness addresses bias in training data or selection criteria that could cause discriminatory outputs. Reliability and safety focuses on mitigating the risk of errors and harm.',
    },
    {
      id: '1-14',
      question:
        'Which text analysis task is often the first step in a multi-stage text processing workflow?',
      options: [
        'Summarization',
        'Language detection',
        'Sentiment analysis',
        'Key-term extraction',
      ],
      correctIndex: 1,
      explanation:
        'Knowing which language a document is written in lets the workflow route it to the right model or process, so language detection usually comes first.',
    },
  ],
}
