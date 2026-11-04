import type { Chapter } from '#/quizzes/types'

export const chapter12: Chapter = {
  id: '12-foundry-vision',
  number: 12,
  title: 'Vision and image generation in Foundry',
  questions: [
    {
      id: '12-01',
      question: 'What is a multimodal model?',
      options: [
        'A model that only processes images',
        'A model that can understand and work with more than one type of data, such as text and images',
        'A model that only generates video',
        'A model that is deployed in multiple regions',
      ],
      correctIndex: 1,
      explanation:
        'Multimodal models accept several input types (text, images, audio, video), for example to describe a photo or answer a question about it.',
    },
    {
      id: '12-02',
      question:
        'You want to generate a natural-language description of an uploaded image in the Foundry chat playground. What type of deployed model do you need?',
      options: [
        'A multimodal (vision-enabled) model',
        'An image-generation model',
        'A text-embedding model',
        'A speech-to-text model',
      ],
      correctIndex: 0,
      explanation:
        'A vision-enabled multimodal model processes image input and responds in natural language. An image-generation model creates images rather than describing them.',
    },
    {
      id: '12-03',
      question:
        'A Python app receives a user question and an image URL and must answer questions about what is visible in the image. What should it send in the Responses API request?',
      options: [
        'The question and the URL together as input_text',
        'The question as input_text and the model name as input_image',
        'The question as an image-generation prompt',
        'The question as input_text and the image URL as input_image',
      ],
      correctIndex: 3,
      explanation:
        'Text goes in an input_text content part and the image in an input_image part of the same message. A URL inside text is not processed as visual input.',
    },
    {
      id: '12-04',
      question:
        'Which two statements about sending images to a vision-enabled model with the Responses API are true? Select two.',
      options: [
        'A single request can include both text input and image input',
        'Images can be provided as URLs or as base64-encoded data',
        'Images can only be provided as public URLs',
        'Each image requires a separate request',
      ],
      correctIndexes: [0, 1],
      explanation:
        'The model processes text and images in one request; images can be URLs or base64 data URLs. Several images (for example to compare them) can be sent as separate input_image parts.',
    },
    {
      id: '12-05',
      question:
        'When your app calls a model you deployed in Foundry with the OpenAI Python SDK, which value do you pass as the model parameter?',
      options: [
        'The base model name, such as "gpt-image-1"',
        'The name of the Foundry resource',
        'The deployment name you gave the model',
        'The Azure region',
      ],
      correctIndex: 2,
      explanation:
        'The model parameter is the deployment name. It only matches the base model name if you did not customize the name when deploying.',
    },
    {
      id: '12-06',
      question:
        'Why is base64 encoding used when sending an image in a JSON request?',
      options: [
        'It compresses the image to reduce cost',
        'It converts binary image data into ASCII text that can be embedded in JSON or a URL',
        'It encrypts the image so only the model can read it',
        'It converts the image to grayscale',
      ],
      correctIndex: 1,
      explanation:
        'Images are binary, while JSON and URLs are text-only. Base64 turns the bytes into safe text; it is not compression or encryption.',
    },
    {
      id: '12-07',
      question:
        'A Python web app must create a new 1024 x 1024 image from a user prompt and show it in a browser. Which request pattern should it use?',
      options: [
        'Send the prompt to the image generations endpoint and decode the returned image data',
        'Send the prompt to the image edits endpoint with an existing source image',
        'Send the prompt to an embeddings endpoint and render the vectors',
        'Return the raw HTTP response body to the browser',
      ],
      correctIndex: 0,
      explanation:
        'The image is returned as encoded data (base64) that must be decoded before display. The edits endpoint is for starting from an existing image.',
    },
    {
      id: '12-08',
      question:
        'An app must create a new product image based on an existing PNG and a text prompt. Which capability should it use?',
      options: [
        'Text-to-image generation',
        'Object detection',
        'Text embedding',
        'Image-to-image editing',
      ],
      correctIndex: 3,
      explanation:
        'Image-to-image editing starts from an existing image and changes it according to the prompt. Text-to-image creates an image from the prompt alone.',
    },
    {
      id: '12-09',
      question:
        'Which three capabilities are image generation features of a generative AI model? Select three.',
      options: [
        'Creating a new image from a description',
        'Editing an existing image',
        'Creating variations of an image',
        'Extracting the RGB values of an image',
        'Detecting landmarks in an image',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'Generative image models create, edit and vary images. Extracting pixel values and detecting landmarks are image analysis tasks.',
    },
    {
      id: '12-10',
      question:
        'What should you add to a prompt to better guide an image-generation model toward the result you want?',
      options: [
        'The model deployment name and image size',
        'Visual details about the subject, setting and style',
        'Labels extracted from image analysis',
        'A short list of object names only',
      ],
      correctIndex: 1,
      explanation:
        'Descriptive details about subject, setting and style guide the generated image. Deployment name and size are configuration, not prompt content.',
    },
    {
      id: '12-11',
      question:
        'Why is video generation with Sora models in Foundry handled as an asynchronous job?',
      options: [
        'Because the user must interact with the video during rendering',
        'Because the REST API does not support any synchronous requests',
        'Because video generation is resource-intensive and takes time to complete',
        'Because videos must first be reviewed by a human',
      ],
      correctIndex: 2,
      explanation:
        'Generating a video can take minutes, so you create a job, poll its status and download the video when it is complete.',
    },
    {
      id: '12-12',
      question:
        'Which three steps make up the asynchronous video generation workflow through the REST interface? Select three.',
      options: [
        'Create a video generation job',
        'Poll the job status until it is completed',
        'Download the finished video',
        'Stream each frame live while it renders',
        'Retrain the model with the prompt',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'The API has separate endpoints to start a render job, check its status and download the MP4 once the status is completed.',
    },
    {
      id: '12-13',
      question:
        'Which kind of model is needed for an app that accepts spoken input and an image in the same prompt?',
      options: [
        'An embedding model',
        'An image generation model',
        'Prompt Shields',
        'A multimodal model',
      ],
      correctIndex: 3,
      explanation:
        'Processing more than one input type (speech and image) and generating a response requires a multimodal model. Prompt Shields detect prompt attacks.',
    },
  ],
}
