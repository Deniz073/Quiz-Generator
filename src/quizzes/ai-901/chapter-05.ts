import type { Chapter } from '../types'

export const chapter05: Chapter = {
  id: '5-computer-vision',
  number: 5,
  title: 'Computer vision concepts',
  questions: [
    {
      id: '5-01',
      question:
        'Computer vision is based on the manipulation and analysis of which values in an image?',
      options: [
        'Timestamps in the photo metadata',
        'Image file names',
        'Pixel values',
        'The camera model',
      ],
      correctIndex: 2,
      explanation:
        'To a computer, an image is an array of numeric pixel values. Grayscale uses one layer (0 = black, 255 = white); color images usually have three RGB channels.',
    },
    {
      id: '5-02',
      question: 'How is a typical digital color image represented?',
      options: [
        'As one 2D array of values from 0 to 1',
        'As three channels (red, green and blue) of pixel values',
        'As a list of object labels',
        'As a vector of word embeddings',
      ],
      correctIndex: 1,
      explanation:
        'Most color images have three layers (channels) for red, green and blue; the combination of the three values defines each pixel color.',
    },
    {
      id: '5-03',
      question:
        'A 3x3 filter kernel with -1 around a center value of 8 is convolved across an image. What is the effect?',
      options: [
        'It highlights the edges of shapes in the image',
        'It blurs the image',
        'It converts the image to grayscale',
        'It increases the resolution',
      ],
      correctIndex: 0,
      explanation:
        'This is a Laplace filter, which highlights edges. Other kernels create blurring, sharpening or color inversion effects.',
    },
    {
      id: '5-04',
      question:
        'What is the primary role of filters in a convolutional neural network (CNN) used for image classification?',
      options: [
        'To apply visual effects that make the image look better',
        'To compress images for faster upload',
        'To label the training images',
        'To extract numeric features (feature maps) for use in a neural network',
      ],
      correctIndex: 3,
      explanation:
        'CNN filters extract feature maps that are flattened and fed into a fully connected network to predict a label. The filter weights start random and are learned during training.',
    },
    {
      id: '5-05',
      question:
        'The output layer of a fruit classification CNN returns [0.2, 0.5, 0.3]. What do these values represent?',
      options: [
        'The RGB values of the dominant color',
        'A probability for each possible class',
        'The coordinates of a bounding box',
        'The filter weights of the last layer',
      ],
      correctIndex: 1,
      explanation:
        'A softmax (or similar) function produces one probability per class. During training these are compared to the actual label to calculate the loss.',
    },
    {
      id: '5-06',
      question:
        'A model must find the locations of different types of vehicles in an image and return a bounding box for each. Which technique is this?',
      options: [
        'Image classification',
        'Optical character recognition',
        'Object detection',
        'Image analysis tagging',
      ],
      correctIndex: 2,
      explanation:
        'Object detection returns which objects were found and the rectangular region (bounding box) for each. Image classification predicts only one label for the whole image.',
    },
    {
      id: '5-07',
      question:
        'A smart checkout must identify one type of produce placed on a scale, such as apple or banana. Which technique is the simplest fit?',
      options: [
        'Semantic segmentation',
        'Image classification',
        'Object detection',
        'Image generation',
      ],
      correctIndex: 1,
      explanation:
        'Predicting a single label for the main subject of an image is image classification. Object detection is needed when several items must be located in the same image.',
    },
    {
      id: '5-08',
      question: 'Which description best matches a vision transformer (ViT)?',
      options: [
        'A model that uses attention over patches of the image to create contextual embeddings of visual features',
        'A tool that applies filters to change how an image looks',
        'An agent that converts a language model into a vision model',
        'A model that only works on grayscale images',
      ],
      correctIndex: 0,
      explanation:
        'A ViT extracts patches of pixels, turns them into vectors and uses attention to embed contextual relationships between patches, just like language transformers do with tokens.',
    },
    {
      id: '5-09',
      question:
        'How can a multimodal model describe an image it has never seen before?',
      options: [
        'It looks up the image in a catalog of labeled photos',
        'It runs OCR and reads the text in the image',
        'It uses pixel counts to choose a caption template',
        'It combines language and vision encoders in a shared vector space, so visual features can be matched with associated language',
      ],
      correctIndex: 3,
      explanation:
        'Training on images with text descriptions and using cross-modal attention creates a unified representation, so the model can find language associated with the visual features it recognizes.',
    },
    {
      id: '5-10',
      question:
        'Most modern image-generation models use diffusion. How does diffusion create an image?',
      options: [
        'It retrieves the closest image from a curated catalog',
        'It starts from random noise and iteratively removes noise until the image matches the prompt',
        'It stitches together patches from the training images',
        'It applies a Laplace filter to a template image',
      ],
      correctIndex: 1,
      explanation:
        'Diffusion begins with random pixel values and removes noise in iterations, checking the result against the prompt after each step. It generates new images rather than retrieving existing ones.',
    },
    {
      id: '5-11',
      question:
        'Which two additional factors must video generation take into account compared to image generation? Select two.',
      options: [
        'The physical behavior of objects in the real world',
        'The temporal progression of the scene',
        'The OCR confidence of text in each frame',
        'The ISO language code of the prompt',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Video generation also has to respect physics (a dog walks with its feet on the ground) and time (a logical sequence of activity).',
    },
    {
      id: '5-12',
      question:
        'Which computer vision feature associates an image with metadata that summarizes its attributes?',
      options: [
        'Categorizing',
        'Detecting image types',
        'Tagging',
        'Content organization',
      ],
      correctIndex: 2,
      explanation:
        'Tagging attaches descriptive tags (metadata) to an image based on its contents. Categorizing places the image in a broader category.',
    },
    {
      id: '5-13',
      question:
        'Which computer vision technique classifies each individual pixel based on the object it belongs to?',
      options: [
        'Semantic segmentation',
        'Object detection',
        'Image classification',
        'Edge detection',
      ],
      correctIndex: 0,
      explanation:
        'Semantic segmentation gives a pixel-level, more precise location than the rectangular bounding box from object detection.',
    },
  ],
}
