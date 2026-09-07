export interface QuizQuestionDef {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

export const DEMO_GENERAL_ASSESSMENT_QUESTIONS: QuizQuestionDef[] = [
  {
    id: 'demo_gen_q1',
    question: 'In software development, what is the primary purpose of version control systems like Git?',
    options: [
      'To track code changes, collaborate across branches, and preserve revision history',
      'To permanently delete older source files from cloud storage',
      'To convert application code into hardware electrical pulses',
      'To format and partition hard disk drives'
    ],
    correctIndex: 0,
    skill: 'Version Control & Git',
    difficulty: 'beginner',
    explanation: 'Version control systems like Git record code modifications, enabling teams to safely collaborate and track project history.'
  },
  {
    id: 'demo_gen_q2',
    question: 'What is the primary role of an API (Application Programming Interface) in modern web applications?',
    options: [
      'To physically assemble computer monitors and peripherals',
      'To enable different software systems and services to communicate and exchange data securely',
      'To erase database records whenever users log in',
      'To permanently disconnect servers from the internet'
    ],
    correctIndex: 1,
    skill: 'Web APIs & Networking',
    difficulty: 'beginner',
    explanation: 'APIs provide standardized contracts and endpoints that enable distinct applications and services to interact and share data.'
  },
  {
    id: 'demo_gen_q3',
    question: 'Which of the following represents an essential best practice for writing maintainable software?',
    options: [
      'Writing modular, readable functions with meaningful variable names and unit tests',
      'Writing all program logic in a single 50,000-line file without documentation',
      'Storing secret credentials directly in unencrypted public repositories',
      'Deploying code directly to production without testing or reviews'
    ],
    correctIndex: 0,
    skill: 'Software Best Practices',
    difficulty: 'beginner',
    explanation: 'Modular code design, descriptive naming conventions, and automated testing are fundamental to maintainable systems.'
  },
  {
    id: 'demo_gen_q4',
    question: 'Which lightweight data format is universally used to transmit structured data between web browsers and servers?',
    options: [
      'JSON (JavaScript Object Notation)',
      'Uncompressed RAW Audio Format',
      'Kernel Memory Binary Core Dump',
      'Floppy Disk Partition Map'
    ],
    correctIndex: 0,
    skill: 'Web Standards & JSON',
    difficulty: 'beginner',
    explanation: 'JSON is the standard lightweight, human-readable data format used across modern REST and web APIs.'
  },
  {
    id: 'demo_gen_q5',
    question: 'In database management, what is the primary function of a Primary Key in a relational table?',
    options: [
      'To uniquely identify each individual row or record in the table',
      'To randomly delete rows when table capacity reaches 80%',
      'To prevent developers from running SQL SELECT queries',
      'To compress image files into plain text strings'
    ],
    correctIndex: 0,
    skill: 'Database Fundamentals',
    difficulty: 'beginner',
    explanation: 'A primary key uniquely identifies each record in a relational database table, enforcing entity integrity.'
  },
  {
    id: 'demo_gen_q6',
    question: 'What is the primary objective of automated Unit Testing in software engineering?',
    options: [
      'To verify that individual functions and components perform as expected and prevent regressions',
      'To deliberately introduce syntax errors into source code',
      'To slow down the developer build process without checking functionality',
      'To disable all error logging in production environments'
    ],
    correctIndex: 0,
    skill: 'Software Testing & Quality',
    difficulty: 'beginner',
    explanation: 'Automated unit tests validate that software components work correctly in isolation, catching bugs before deployment.'
  }
];

export function getDemoTwoQuestionsForJob(jobId: string): QuizQuestionDef[] {
  const len = DEMO_GENERAL_ASSESSMENT_QUESTIONS.length;
  const hash = (jobId || 'demo').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const firstIdx = hash % len;
  const secondIdx = (firstIdx + 1) % len;
  return [DEMO_GENERAL_ASSESSMENT_QUESTIONS[firstIdx], DEMO_GENERAL_ASSESSMENT_QUESTIONS[secondIdx]];
}

export const QUESTION_BANK: QuizQuestionDef[] = [
  ...DEMO_GENERAL_ASSESSMENT_QUESTIONS,
  // =================== 1. PYTHON (6 questions) ===================
  {
    id: 'py_q1',
    question: 'What is the primary memory and performance difference between a list comprehension and a generator expression in Python?',
    options: [
      'A list comprehension allocates the entire sequence in memory eagerly, while a generator yields elements lazily on demand.',
      'A generator expression can only yield integer data types.',
      'List comprehensions can only be executed in a single thread.',
      'Generators are deprecated in modern Python 3.12+.'
    ],
    correctIndex: 0,
    skill: 'Python',
    difficulty: 'intermediate',
    explanation: 'Generators utilize Python iterator protocols to stream items one at a time, conserving RAM for large datasets.'
  },
  {
    id: 'py_q2',
    question: 'How does the Global Interpreter Lock (GIL) in standard CPython impact CPU-bound multi-threaded programs?',
    options: [
      'It allows true multi-core parallel execution across all operating system threads.',
      'It restricts bytecode execution to one native thread at a time, preventing multi-threaded CPU-bound parallelism.',
      'It only affects network I/O calls and socket listeners.',
      'It automatically compiles Python bytecodes into GPU machine instructions.'
    ],
    correctIndex: 1,
    skill: 'Python',
    difficulty: 'advanced',
    explanation: 'The CPython GIL prevents race conditions in memory management by ensuring only one thread runs Python bytecode at any given moment.'
  },
  {
    id: 'py_q3',
    question: 'What occurs when a mutable container (like a list or dict) is used as a default argument in a Python function?',
    options: [
      'Python throws a TypeError when the function is defined.',
      'A fresh empty container is created each time the function is called.',
      'The default object is instantiated once at function definition, mutating across all subsequent calls that omit the argument.',
      'The parameter becomes read-only and immutable.'
    ],
    correctIndex: 2,
    skill: 'Python',
    difficulty: 'beginner',
    explanation: 'Default arguments in Python are evaluated once when the function is defined, not dynamically on each invocation.'
  },
  {
    id: 'py_q4',
    question: 'Which built-in standard library module provides O(1) time complexity for appending and popping from both ends?',
    options: [
      'collections.deque',
      'array.array',
      'queue.PriorityQueue',
      'itertools.chain'
    ],
    correctIndex: 0,
    skill: 'Python',
    difficulty: 'intermediate',
    explanation: 'collections.deque is implemented as a doubly linked list of blocks, providing fast O(1) pops and appends from either end.'
  },
  {
    id: 'py_q5',
    question: 'In Python, what is the purpose of the `__slots__` attribute in a class declaration?',
    options: [
      'To enforce private variable encapsulation.',
      'To explicitly declare allowed instance attributes and prevent the creation of a dynamic `__dict__`, saving significant memory.',
      'To enable multi-threading concurrency without locks.',
      'To bind database columns directly to class variables.'
    ],
    correctIndex: 1,
    skill: 'Python',
    difficulty: 'advanced',
    explanation: '__slots__ eliminates the default per-instance dictionary, reducing memory footprint for millions of small class instances.'
  },
  {
    id: 'py_q6',
    question: 'Which decorator in the Python `functools` module memoizes function calls based on argument hashes?',
    options: [
      '@functools.lru_cache',
      '@functools.singledispatch',
      '@functools.wraps',
      '@functools.total_ordering'
    ],
    correctIndex: 0,
    skill: 'Python',
    difficulty: 'intermediate',
    explanation: 'functools.lru_cache caches recent function calls and returns the cached result when equal arguments are supplied.'
  },

  // =================== 2. MACHINE LEARNING (6 questions) ===================
  {
    id: 'ml_q1',
    question: 'What is the primary indicator of overfitting in a trained machine learning model?',
    options: [
      'High training loss and high validation loss.',
      'Very low training loss accompanied by significantly higher validation loss.',
      'Fast convergence during gradient descent.',
      'The confusion matrix shows balanced false positive and false negative rates.'
    ],
    correctIndex: 1,
    skill: 'Machine Learning',
    difficulty: 'beginner',
    explanation: 'Overfitting occurs when a model memorizes noise in the training set, failing to generalize to unseen validation data.'
  },
  {
    id: 'ml_q2',
    question: 'In supervised classification with severe class imbalance (e.g., 99% negative, 1% positive), which metric is least informative?',
    options: [
      'Accuracy',
      'Precision-Recall AUC',
      'F1-Score',
      'Balanced Accuracy'
    ],
    correctIndex: 0,
    skill: 'Machine Learning',
    difficulty: 'intermediate',
    explanation: 'A naive model that predicts only the majority class achieves 99% accuracy while failing completely on the target minority class.'
  },
  {
    id: 'ml_q3',
    question: 'What is the mathematical distinction between L1 (Lasso) and L2 (Ridge) regularization?',
    options: [
      'L1 penalizes absolute weights and can drive parameters to exact zero (sparsity); L2 penalizes squared weights and shrinks them smoothly.',
      'L2 causes sparse feature selection while L1 prevents gradient explosions.',
      'L1 can only be applied to logistic regression, whereas L2 is restricted to linear regression.',
      'L1 increases model variance while L2 increases training error.'
    ],
    correctIndex: 0,
    skill: 'Machine Learning',
    difficulty: 'intermediate',
    explanation: 'L1 regularization adds the absolute sum of coefficients, creating diamond-shaped constraint boundaries that zero out uninformative features.'
  },
  {
    id: 'ml_q4',
    question: 'Which ensemble method builds decision trees sequentially to correct the residual errors of preceding trees?',
    options: [
      'Gradient Boosting (e.g. XGBoost, LightGBM)',
      'Random Forests',
      'Bagging Classifier',
      'K-Means Clustering'
    ],
    correctIndex: 0,
    skill: 'Machine Learning',
    difficulty: 'intermediate',
    explanation: 'Boosting fits successive shallow trees to the negative gradient (residuals) of the loss function, reducing model bias.'
  },
  {
    id: 'ml_q5',
    question: 'What does the ROC-AUC score measure in binary classification?',
    options: [
      'The probability that a classifier ranks a randomly chosen positive instance higher than a randomly chosen negative instance.',
      'The exact accuracy of the model at a fixed 0.5 decision threshold.',
      'The ratio of true negatives to total dataset size.',
      'The mean squared error of the predicted probabilities.'
    ],
    correctIndex: 0,
    skill: 'Machine Learning',
    difficulty: 'advanced',
    explanation: 'ROC-AUC evaluates ranking capability across all possible decision thresholds, plotting True Positive Rate vs False Positive Rate.'
  },
  {
    id: 'ml_q6',
    question: 'When performing feature scaling for algorithms sensitive to distance metrics (e.g., KNN, SVM), which technique bounds features strictly between 0 and 1?',
    options: [
      'Min-Max Normalization',
      'StandardScaler (Z-Score Standardization)',
      'RobustScaler',
      'Log Transformation'
    ],
    correctIndex: 0,
    skill: 'Machine Learning',
    difficulty: 'beginner',
    explanation: 'Min-Max scaling computes (x - min) / (max - min), scaling values into the [0, 1] interval.'
  },

  // =================== 3. DEEP LEARNING (5 questions) ===================
  {
    id: 'dl_q1',
    question: 'Why is the Rectified Linear Unit (ReLU) preferred over Sigmoid in deep feed-forward neural networks?',
    options: [
      'ReLU mitigates the vanishing gradient problem for positive inputs because its derivative is constant (1.0).',
      'ReLU outputs values bounded strictly between -1 and +1.',
      'ReLU requires matrix inversion during backpropagation.',
      'ReLU prevents dying neurons under all negative activations.'
    ],
    correctIndex: 0,
    skill: 'Deep Learning',
    difficulty: 'intermediate',
    explanation: 'Sigmoid saturates at both tails with near-zero derivatives, causing vanishing gradients in deep layers; ReLU retains a constant gradient for x > 0.'
  },
  {
    id: 'dl_q2',
    question: 'What does Batch Normalization achieve during neural network training?',
    options: [
      'It normalizes the activations of each layer across the mini-batch to have zero mean and unit variance, stabilizing internal covariate shift.',
      'It randomly drops 50% of the input weights to prevent overfitting.',
      'It converts continuous weights into 8-bit quantized integers.',
      'It enforces orthogonal weight matrices across convolutional kernels.'
    ],
    correctIndex: 0,
    skill: 'Deep Learning',
    difficulty: 'intermediate',
    explanation: 'Batch Normalization stabilizes training dynamics, permits higher learning rates, and reduces sensitivity to parameter initialization.'
  },
  {
    id: 'dl_q3',
    question: 'In PyTorch, what is the crucial difference between `torch.no_grad()` and `model.eval()`?',
    options: [
      '`torch.no_grad()` disables the autograd gradient tape saving memory, while `model.eval()` switches dropout and batchnorm layers into inference mode.',
      '`model.eval()` computes gradients faster, while `torch.no_grad()` deletes the model weights.',
      'Both commands do the exact same thing interchangeably.',
      '`torch.no_grad()` is only for CPU tensors, while `model.eval()` is for CUDA GPUs.'
    ],
    correctIndex: 0,
    skill: 'Deep Learning',
    difficulty: 'advanced',
    explanation: 'You should use both during validation: `model.eval()` ensures layers behave as inference modules, while `torch.no_grad()` prevents autograd tracking.'
  },
  {
    id: 'dl_q4',
    question: 'Which loss function is mathematically standard for multi-class classification where classes are mutually exclusive?',
    options: [
      'Categorical Cross-Entropy (Negative Log Likelihood with Softmax)',
      'Binary Cross-Entropy',
      'Mean Absolute Error (L1 Loss)',
      'Hinge Loss'
    ],
    correctIndex: 0,
    skill: 'Deep Learning',
    difficulty: 'beginner',
    explanation: 'Categorical cross-entropy penalizes divergence between the true one-hot distribution and the predicted Softmax probability vector.'
  },
  {
    id: 'dl_q5',
    question: 'What is the role of the Adam optimizer over standard stochastic gradient descent (SGD)?',
    options: [
      'It combines adaptive learning rates using first moments (momentum) and second moments (uncentered variance) of past gradients.',
      'It uses second-order Hessian matrix inversion on every step.',
      'It guarantees global minimum convergence for non-convex loss surfaces.',
      'It operates purely without hyperparameters like learning rate.'
    ],
    correctIndex: 0,
    skill: 'Deep Learning',
    difficulty: 'advanced',
    explanation: 'Adam (Adaptive Moment Estimation) computes exponentially decaying moving averages of past gradients and squared gradients.'
  },

  // =================== 4. NLP (5 questions) ===================
  {
    id: 'nlp_q1',
    question: 'In the Transformer architecture, what is the computational complexity of the Self-Attention mechanism with respect to sequence length N?',
    options: [
      'O(N^2)',
      'O(N)',
      'O(N log N)',
      'O(1)'
    ],
    correctIndex: 0,
    skill: 'Natural Language Processing',
    difficulty: 'advanced',
    explanation: 'Standard multi-head self-attention computes an N x N attention matrix (Q * K^T), scaling quadratically with sequence length.'
  },
  {
    id: 'nlp_q2',
    question: 'What is the function of Positional Encodings in Transformer models?',
    options: [
      'To inject information regarding the sequential order of tokens since self-attention is permutation-invariant.',
      'To compress the vocabulary size into 256 dimensions.',
      'To prevent the model from generating toxic tokens.',
      'To translate source words into foreign language equivalents.'
    ],
    correctIndex: 0,
    skill: 'Natural Language Processing',
    difficulty: 'intermediate',
    explanation: 'Because attention operations process all tokens in parallel without recurrence, positional encodings provide word order information.'
  },
  {
    id: 'nlp_q3',
    question: 'What subword tokenization algorithm is utilized by BERT and GPT to resolve Out-of-Vocabulary (OOV) words?',
    options: [
      'Byte-Pair Encoding (BPE) / WordPiece',
      'One-Hot Encoding',
      'TF-IDF Tokenization',
      'Bag-of-Words'
    ],
    correctIndex: 0,
    skill: 'Natural Language Processing',
    difficulty: 'intermediate',
    explanation: 'BPE and WordPiece decompose rare or unseen words into frequent subword units, enabling models to represent any string.'
  },
  {
    id: 'nlp_q4',
    question: 'In semantic search and vector retrieval, which mathematical metric measures the orientation angle between two text embeddings?',
    options: [
      'Cosine Similarity',
      'Euclidean Manhattan Distance',
      'Levenshtein Distance',
      'Hamming Distance'
    ],
    correctIndex: 0,
    skill: 'Natural Language Processing',
    difficulty: 'beginner',
    explanation: 'Cosine similarity computes (A · B) / (||A|| * ||B||), normalizing for vector magnitude and capturing semantic alignment.'
  },
  {
    id: 'nlp_q5',
    question: 'What is the architectural difference between BERT and GPT?',
    options: [
      'BERT is an encoder-only model trained with masked language modeling (bidirectional), while GPT is a causal decoder-only autoregressive model.',
      'BERT is designed exclusively for image captioning, while GPT is for speech.',
      'GPT has no attention layers and uses recurrence instead.',
      'BERT does not use pre-training and is trained from scratch on every prompt.'
    ],
    correctIndex: 0,
    skill: 'Natural Language Processing',
    difficulty: 'intermediate',
    explanation: 'BERT attends to left and right context simultaneously for classification/NER; GPT predicts the next token from left context for text generation.'
  },

  // =================== 5. REACT (6 questions) ===================
  {
    id: 'react_q1',
    question: 'What is the primary motivation for using the `useCallback` hook in React?',
    options: [
      'To memoize a callback function reference across re-renders, preventing unnecessary child component re-renders when passed as a prop.',
      'To make an asynchronous API call during server-side rendering.',
      'To mutate component state directly without triggering a re-render.',
      'To run code after the DOM has been painted.'
    ],
    correctIndex: 0,
    skill: 'React',
    difficulty: 'intermediate',
    explanation: 'useCallback caches the function instance between renders unless one of its dependencies changes.'
  },
  {
    id: 'react_q2',
    question: 'Why should the index of an array generally NOT be used as the `key` prop in mapped lists?',
    options: [
      'It can cause subtle state bugs and poor reconciliation performance when list items are reordered, inserted, or removed.',
      'React will throw a runtime exception if an index is passed.',
      'Array indices consume double the memory in the virtual DOM.',
      'It breaks TypeScript compiler checks.'
    ],
    correctIndex: 0,
    skill: 'React',
    difficulty: 'beginner',
    explanation: 'Using array indices as keys confuses React identity tracking when items change position, preserving wrong component state.'
  },
  {
    id: 'react_q3',
    question: 'When should you use `useRef` instead of `useState` in React?',
    options: [
      'When you need to persist a mutable value across renders without triggering a component re-render when the value changes.',
      'When you need to trigger a UI re-render on every keystroke.',
      'When creating global CSS styles dynamically.',
      'useRef is deprecated in modern React.'
    ],
    correctIndex: 0,
    skill: 'React',
    difficulty: 'intermediate',
    explanation: 'useRef returns a mutable object whose `.current` property can hold any value, persisting without triggering renders.'
  },
  {
    id: 'react_q4',
    question: 'What does React 18 Concurrent Rendering enable through `useTransition`?',
    options: [
      'Marking specific state updates as non-urgent transitions, keeping the user interface responsive during heavy computations.',
      'Executing React code in parallel web worker threads automatically.',
      'Eliminating the need for the virtual DOM completely.',
      'Enabling multi-tab synchronized state storage.'
    ],
    correctIndex: 0,
    skill: 'React',
    difficulty: 'advanced',
    explanation: 'startTransition tells React that an update can be interrupted if a higher-priority interaction (e.g. typing) occurs.'
  },
  {
    id: 'react_q5',
    question: 'What is the cleanup function in `useEffect` used for?',
    options: [
      'To clean up subscriptions, timers, or abort fetch controllers before the component unmounts or before the effect runs again.',
      'To clear the browser cache and local storage.',
      'To reset all state variables to null.',
      'To garbage collect unused JavaScript variables.'
    ],
    correctIndex: 0,
    skill: 'React',
    difficulty: 'beginner',
    explanation: 'Returning a function from useEffect executes cleanup before the next effect run and upon component unmounting.'
  },
  {
    id: 'react_q6',
    question: 'What is the purpose of React Error Boundaries?',
    options: [
      'Catching JavaScript errors anywhere in their child component tree, logging them, and displaying a fallback UI instead of crashing the app.',
      'Preventing 404 HTTP errors on the backend server.',
      'Handling rejected promises inside asynchronous event handlers.',
      'Checking TypeScript type definitions at runtime.'
    ],
    correctIndex: 0,
    skill: 'React',
    difficulty: 'intermediate',
    explanation: 'Class components implementing `componentDidCatch` or `static getDerivedStateFromError` capture errors in the render tree.'
  },

  // =================== 6. JAVASCRIPT (6 questions) ===================
  {
    id: 'js_q1',
    question: 'In JavaScript event loop mechanics, what executes first between a Microtask (Promise.then) and a Macrotask (setTimeout)?',
    options: [
      'All pending microtasks in the microtask queue are drained before the next macrotask executes.',
      'setTimeout macrotasks always take priority.',
      'They execute in alternating round-robin order.',
      'The browser randomly selects between them.'
    ],
    correctIndex: 0,
    skill: 'JavaScript',
    difficulty: 'intermediate',
    explanation: 'After each synchronous task, the JavaScript engine processes all pending microtasks before fetching the next macrotask.'
  },
  {
    id: 'js_q2',
    question: 'What is a closure in JavaScript?',
    options: [
      'A function bundled together with references to its lexical environment, allowing it to access outer variables even after the outer function has closed.',
      'A method used to close an open database socket connection.',
      'A syntax error that prevents function execution.',
      'An immediately invoked function that deletes itself from memory.'
    ],
    correctIndex: 0,
    skill: 'JavaScript',
    difficulty: 'beginner',
    explanation: 'Closures give inner functions persistent access to outer scope variables even when executed outside that scope.'
  },
  {
    id: 'js_q3',
    question: 'What is the difference between `==` (loose equality) and `===` (strict equality)?',
    options: [
      '`===` checks both value and type without type coercion, whereas `==` performs implicit type coercion before comparison.',
      '`==` checks memory pointers while `===` checks values.',
      '`===` is only used for comparing Objects and Arrays.',
      'There is no difference in ES6+.'
    ],
    correctIndex: 0,
    skill: 'JavaScript',
    difficulty: 'beginner',
    explanation: 'Loose equality coerces operands to matching types (e.g. "5" == 5 is true), while strict equality requires identical types.'
  },
  {
    id: 'js_q4',
    question: 'What does `Promise.allSettled()` do compared to `Promise.all()`?',
    options: [
      'It waits for all promises to either resolve or reject, returning an array of outcome objects without short-circuiting on rejection.',
      'It rejects immediately when the first promise fails.',
      'It executes promises serially one by one instead of concurrently.',
      'It automatically retries rejected promises 3 times.'
    ],
    correctIndex: 0,
    skill: 'JavaScript',
    difficulty: 'intermediate',
    explanation: 'Promise.all rejects immediately if any single promise fails, whereas Promise.allSettled waits for all to conclude.'
  },
  {
    id: 'js_q5',
    question: 'What is the value of `this` inside an ES6 arrow function?',
    options: [
      'It lexically inherits `this` from the enclosing execution context where it was defined.',
      'It always refers to the global `window` or `globalThis` object.',
      'It dynamically binds to the object that invoked the function.',
      'It is always `undefined`.'
    ],
    correctIndex: 0,
    skill: 'JavaScript',
    difficulty: 'intermediate',
    explanation: 'Arrow functions do not have their own `this` binding; they capture `this` from their surrounding lexical scope.'
  },
  {
    id: 'js_q6',
    question: 'What is the purpose of the `WeakMap` data structure in JavaScript?',
    options: [
      'Keys must be objects and are held weakly, allowing them to be garbage collected if no other references exist, preventing memory leaks.',
      'It can only store numbers and booleans.',
      'It sorts entries automatically by key alphabetically.',
      'It allows duplicate keys without overwriting.'
    ],
    correctIndex: 0,
    skill: 'JavaScript',
    difficulty: 'advanced',
    explanation: 'WeakMap references do not prevent garbage collection of key objects, ideal for storing private metadata without memory leaks.'
  },

  // =================== 7. NODE.JS (5 questions) ===================
  {
    id: 'node_q1',
    question: 'How does Node.js handle thousands of concurrent I/O operations despite having a single main execution thread?',
    options: [
      'Via non-blocking event-driven architecture powered by `libuv` and its background thread pool for system calls.',
      'By spawning a separate operating system process for every connected client.',
      'By compiling JavaScript directly into multi-threaded assembly language.',
      'Node.js actually runs multiple V8 engines on each HTTP request.'
    ],
    correctIndex: 0,
    skill: 'Node.js',
    difficulty: 'intermediate',
    explanation: 'Node.js delegates non-blocking I/O to the kernel (epoll/kqueue) and uses libuv thread pool for disk/DNS operations.'
  },
  {
    id: 'node_q2',
    question: 'What problem do Node.js Streams solve when handling large files or payloads?',
    options: [
      'They process data chunk-by-chunk in memory buffers, avoiding reading the entire file into RAM at once.',
      'They compress data into zip archives on the fly.',
      'They convert HTTP requests into synchronous blocking calls.',
      'They prevent SQL injection vulnerabilities automatically.'
    ],
    correctIndex: 0,
    skill: 'Node.js',
    difficulty: 'intermediate',
    explanation: 'Streams allow processing continuous chunks of data, enabling high throughput with minimal, constant RAM usage.'
  },
  {
    id: 'node_q3',
    question: 'In Express.js middleware, what happens if a middleware function does not call `next()` and does not send a response?',
    options: [
      'The client request hangs indefinitely until a gateway timeout occurs.',
      'Express automatically sends a 200 OK response.',
      'Node.js terminates the process with an uncaught exception.',
      'The request skips to the error handler middleware.'
    ],
    correctIndex: 0,
    skill: 'Node.js',
    difficulty: 'beginner',
    explanation: 'Without invoking `next()` or ending the response with `res.send()/res.json()`, the HTTP cycle remains open and hangs.'
  },
  {
    id: 'node_q4',
    question: 'What is the purpose of the Node.js `cluster` module?',
    options: [
      'To spawn multiple child worker processes that share the same server port, taking advantage of multi-core CPU architectures.',
      'To connect to a Kubernetes cluster directly from JavaScript.',
      'To cluster database queries into single transactions.',
      'To group npm packages into bundles.'
    ],
    correctIndex: 0,
    skill: 'Node.js',
    difficulty: 'advanced',
    explanation: 'The cluster module creates child processes that share server sockets, maximizing CPU utilization on multi-core servers.'
  },
  {
    id: 'node_q5',
    question: 'Which method should be used to securely hash and salt user passwords in a Node.js backend?',
    options: [
      'bcrypt or argon2 with an adaptive work factor',
      'crypto.createHash("md5")',
      'crypto.createHash("sha256")',
      'Base64 encoding'
    ],
    correctIndex: 0,
    skill: 'Node.js',
    difficulty: 'beginner',
    explanation: 'Fast hashes like MD5 and SHA-256 are vulnerable to GPU brute-force; password hashing requires computationally slow algorithms like bcrypt or argon2.'
  },

  // =================== 8. MONGODB (5 questions) ===================
  {
    id: 'mongo_q1',
    question: 'In MongoDB, what is the default unique index automatically created on every collection?',
    options: [
      '_id',
      'createdAt',
      'uuid',
      'primaryKey'
    ],
    correctIndex: 0,
    skill: 'MongoDB',
    difficulty: 'beginner',
    explanation: 'Every MongoDB document requires an immutable `_id` field indexed with a unique B-tree index.'
  },
  {
    id: 'mongo_q2',
    question: 'What is the purpose of the `$lookup` stage in a MongoDB Aggregation Pipeline?',
    options: [
      'To perform a left outer join to an unsharded collection in the same database.',
      'To search text documents using full-text indexing.',
      'To filter documents based on a regex pattern.',
      'To sort documents in descending order.'
    ],
    correctIndex: 0,
    skill: 'MongoDB',
    difficulty: 'intermediate',
    explanation: '$lookup brings in matched documents from a target collection, mimicking relational left outer joins.'
  },
  {
    id: 'mongo_q3',
    question: 'How do Compound Indexes in MongoDB leverage the "Prefix Rule"?',
    options: [
      'A compound index on `{ a: 1, b: 1, c: 1 }` supports queries on `a`, on `a, b`, and on `a, b, c`, but NOT queries on `b` or `c` alone.',
      'It requires all string fields to start with uppercase letters.',
      'The index can only be used if all query fields are explicitly specified in the exact order.',
      'Prefix indexing only works on array data types.'
    ],
    correctIndex: 0,
    skill: 'MongoDB',
    difficulty: 'advanced',
    explanation: 'B-tree traversal requires matching the leading (prefix) keys of the index to utilize the index efficiently.'
  },
  {
    id: 'mongo_q4',
    question: 'What is the difference between Embedding and Referencing document design in MongoDB?',
    options: [
      'Embedding stores related data within a single document for atomic fast reads; Referencing stores IDs and uses separate queries or `$lookup` to avoid unbound document growth.',
      'Embedding is only supported in MongoDB Atlas, not on self-hosted instances.',
      'Referencing is always 10x faster than embedding.',
      'Embedding limits the database to 100 total records.'
    ],
    correctIndex: 0,
    skill: 'MongoDB',
    difficulty: 'intermediate',
    explanation: 'Embedding is preferred for 1:few relationships; referencing is essential for 1:many or 1:unbounded relationships to prevent exceeding the 16MB document limit.'
  },
  {
    id: 'mongo_q5',
    question: 'What does the `writeConcern: { w: "majority" }` setting ensure in a MongoDB replica set?',
    options: [
      'The write has been committed to a majority of voting replica nodes before acknowledging success to the client.',
      'The write is sent to all clients via websockets.',
      'Only the primary node writes to RAM without flushing to disk.',
      'The write is encrypted using quantum cryptography.'
    ],
    correctIndex: 0,
    skill: 'MongoDB',
    difficulty: 'advanced',
    explanation: 'w: "majority" prevents dirty reads and rollbacks by verifying replication across the cluster majority.'
  },

  // =================== 9. SQL (6 questions) ===================
  {
    id: 'sql_q1',
    question: 'What is the operational difference between the `WHERE` clause and the `HAVING` clause in SQL?',
    options: [
      '`WHERE` filters rows before any grouping or aggregation occurs; `HAVING` filters aggregated group results after `GROUP BY`.',
      '`HAVING` can only be used with subqueries.',
      '`WHERE` cannot be used with string columns.',
      'They are completely interchangeable syntactically.'
    ],
    correctIndex: 0,
    skill: 'SQL',
    difficulty: 'beginner',
    explanation: 'WHERE acts on individual table rows; HAVING acts on aggregated values produced by GROUP BY.'
  },
  {
    id: 'sql_q2',
    question: 'What does the `ROW_NUMBER()` window function in SQL do?',
    options: [
      'Assigns a unique, sequential integer to each row within a partition of the result set, starting at 1.',
      'Returns the total count of rows in the table.',
      'Rounds floating-point numbers to integers.',
      'Deletes duplicate rows from the physical disk.'
    ],
    correctIndex: 0,
    skill: 'SQL',
    difficulty: 'intermediate',
    explanation: 'ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...) assigns sequential integers based on the specified order.'
  },
  {
    id: 'sql_q3',
    question: 'What does the "A" in ACID database transactions stand for, and what does it guarantee?',
    options: [
      'Atomicity: All operations in a transaction complete successfully, or all are rolled back completely with no partial changes.',
      'Availability: The database is always reachable 24/7.',
      'Asynchronous: Queries run in background threads without waiting.',
      'Authorization: Only root users can commit data.'
    ],
    correctIndex: 0,
    skill: 'SQL',
    difficulty: 'intermediate',
    explanation: 'Atomicity ensures that a multi-step transaction is treated as an indivisible unit of work.'
  },
  {
    id: 'sql_q4',
    question: 'Why can a `Seq Scan` (Sequential Scan) occur in PostgreSQL even when an index exists on the queried column?',
    options: [
      'The query planner estimated that the query filters a large portion of the table, making reading sequential disk blocks faster than random index lookups.',
      'PostgreSQL does not support indexes on integer columns.',
      'The index was corrupted by a SELECT query.',
      'Sequential scans only happen when the database is in maintenance mode.'
    ],
    correctIndex: 0,
    skill: 'SQL',
    difficulty: 'advanced',
    explanation: 'The cost-based optimizer switches to sequential scan when table size is small or the query returns a large fraction of total rows.'
  },
  {
    id: 'sql_q5',
    question: 'What is a SQL Injection vulnerability, and how is it primarily prevented in production code?',
    options: [
      'Malicious SQL fragments injected into queries via unsanitized input; prevented using Parameterized Prepared Statements.',
      'A server memory overflow prevented by upgrading RAM.',
      'A network DDoS attack prevented by firewalls.',
      'A syntax error caused by missing semicolons.'
    ],
    correctIndex: 0,
    skill: 'SQL',
    difficulty: 'beginner',
    explanation: 'Prepared statements treat user input strictly as literal parameter data, preventing input from altering the query structure.'
  },
  {
    id: 'sql_q6',
    question: 'What is the purpose of database normalization (up to 3rd Normal Form / 3NF)?',
    options: [
      'To eliminate data redundancy, enforce data integrity, and prevent update/delete anomalies.',
      'To maximize read speeds by duplicating all data across all tables.',
      'To convert SQL databases into NoSQL document stores.',
      'To encrypt all table columns with public keys.'
    ],
    correctIndex: 0,
    skill: 'SQL',
    difficulty: 'intermediate',
    explanation: '3NF ensures every non-key attribute depends solely on the primary key, avoiding anomalies and redundant storage.'
  },

  // =================== 10. DATA SCIENCE (5 questions) ===================
  {
    id: 'ds_q1',
    question: 'In Pandas, what is the most performant method to apply a transformation across a DataFrame column?',
    options: [
      'Vectorized operations (e.g. `df["col"] * 2`) leveraging NumPy underlying C arrays.',
      'Iterating with a Python `for` loop over `df.iterrows()`.',
      'Using `df.apply(lambda x: x * 2)` without vectorized expressions.',
      'Exporting to CSV, processing with Python, and re-importing.'
    ],
    correctIndex: 0,
    skill: 'Data Science',
    difficulty: 'intermediate',
    explanation: 'Vectorized operations operate on contiguous memory blocks at C-speed, avoiding Python interpreter overhead.'
  },
  {
    id: 'ds_q2',
    question: 'What is the Central Limit Theorem (CLT) in statistics?',
    options: [
      'The sampling distribution of the sample mean approaches a normal distribution as sample size increases, regardless of the population distribution shape.',
      'All datasets in nature are strictly normally distributed.',
      'The median is always equal to the mean in large datasets.',
      'Standard deviation decreases to zero when sample size exceeds 30.'
    ],
    correctIndex: 0,
    skill: 'Data Science',
    difficulty: 'intermediate',
    explanation: 'The CLT enables parametric hypothesis testing because sample averages tend toward Gaussian behavior with sufficient N.'
  },
  {
    id: 'ds_q3',
    question: 'What does a p-value less than 0.05 signify in a standard hypothesis test?',
    options: [
      'Assuming the null hypothesis is true, there is less than a 5% probability of observing results as extreme as the sample data, leading to rejection of the null hypothesis.',
      'There is a 95% chance that the research theory is 100% correct.',
      'The sample data has a 5% measurement error rate.',
      'The experiment failed and must be restarted.'
    ],
    correctIndex: 0,
    skill: 'Data Science',
    difficulty: 'intermediate',
    explanation: 'A p-value measures evidence against the null hypothesis; p < 0.05 indicates statistical significance under the chosen alpha threshold.'
  },
  {
    id: 'ds_q4',
    question: 'What does Pearson Correlation measure between two continuous variables?',
    options: [
      'The strength and direction of a linear relationship between the variables, ranging from -1 to +1.',
      'The non-linear cause-and-effect relationship between the variables.',
      'The difference between their median values.',
      'The probability that both variables are normally distributed.'
    ],
    correctIndex: 0,
    skill: 'Data Science',
    difficulty: 'beginner',
    explanation: 'Pearson r evaluates linear correlation; r = 1 is perfect positive correlation, r = 0 means no linear correlation.'
  },
  {
    id: 'ds_q5',
    question: 'How do you detect and handle multicollinearity among predictors in a regression model?',
    options: [
      'Calculate Variance Inflation Factor (VIF) and remove or combine features with VIF > 5-10.',
      'Add more polynomial degrees to the model.',
      'Normalize the target variable using logarithm.',
      'Multicollinearity does not affect regression models.'
    ],
    correctIndex: 0,
    skill: 'Data Science',
    difficulty: 'advanced',
    explanation: 'High VIF indicates that predictor features are linearly correlated with each other, inflating the variance of regression coefficients.'
  },

  // =================== 11. CYBERSECURITY (5 questions) ===================
  {
    id: 'sec_q1',
    question: 'What is the primary architectural principle of a "Zero Trust" security architecture?',
    options: [
      '"Never trust, always verify": Verify every user, device, and connection explicitly, regardless of whether they are inside or outside the network perimeter.',
      'Grant unrestricted access once a user enters through the corporate VPN.',
      'Disable passwords and rely only on IP address whitelisting.',
      'Assume all software is bug-free until proven otherwise.'
    ],
    correctIndex: 0,
    skill: 'Cybersecurity',
    difficulty: 'intermediate',
    explanation: 'Zero Trust eliminates implicit trust based on network perimeter, requiring continuous authentication and least privilege access.'
  },
  {
    id: 'sec_q2',
    question: 'What is a Cross-Site Scripting (XSS) attack?',
    options: [
      'Injecting malicious client-side scripts into web pages viewed by other users, executing in the victim browser context to steal cookies or tokens.',
      'Intercepting raw Wi-Fi packets using a rogue access point.',
      'Flooding a web server with UDP packets to cause an outage.',
      'Exploiting an SQL database through unescaped WHERE clauses.'
    ],
    correctIndex: 0,
    skill: 'Cybersecurity',
    difficulty: 'beginner',
    explanation: 'XSS exploits trust a user has in a website by executing unescaped JavaScript in the victim browser.'
  },
  {
    id: 'sec_q3',
    question: 'What is the function of Cross-Origin Resource Sharing (CORS) headers in web browsers?',
    options: [
      'Allowing web servers to explicitly declare which foreign origins (domains, protocols, ports) are permitted to read their HTTP responses.',
      'Encrypting data packets transferred over the public Internet.',
      'Preventing web scrapers from indexing a website.',
      'Allowing browsers to bypass SSL/TLS certificate verification.'
    ],
    correctIndex: 0,
    skill: 'Cybersecurity',
    difficulty: 'intermediate',
    explanation: 'CORS is a browser security mechanism that relaxes the Same-Origin Policy for trusted explicit domains.'
  },
  {
    id: 'sec_q4',
    question: 'What is the difference between Symmetric and Asymmetric Encryption?',
    options: [
      'Symmetric encryption uses a single shared secret key for both encryption and decryption; Asymmetric encryption uses a mathematically linked public-private key pair.',
      'Asymmetric encryption is 1000x faster than symmetric encryption and is used for large video files.',
      'Symmetric encryption cannot be decrypted once encrypted.',
      'Asymmetric encryption does not require keys.'
    ],
    correctIndex: 0,
    skill: 'Cybersecurity',
    difficulty: 'beginner',
    explanation: 'Symmetric (AES) is fast and uses one key; Asymmetric (RSA/ECC) uses public keys to encrypt and private keys to decrypt.'
  },
  {
    id: 'sec_q5',
    question: 'What type of security attack is mitigated by using `SameSite=Strict` and anti-CSRF tokens on authentication cookies?',
    options: [
      'Cross-Site Request Forgery (CSRF)',
      'Server-Side Request Forgery (SSRF)',
      'DNS Cache Poisoning',
      'Buffer Overflow'
    ],
    correctIndex: 0,
    skill: 'Cybersecurity',
    difficulty: 'intermediate',
    explanation: 'CSRF forces an authenticated browser to send unauthorized HTTP requests; SameSite cookies prevent sending cookies on cross-origin requests.'
  },

  // =================== 12. CLOUD & GCP (5 questions) ===================
  {
    id: 'cld_q1',
    question: 'What is the primary difference between IaaS, PaaS, and SaaS cloud service models?',
    options: [
      'IaaS provides raw infrastructure (VMs/VPCs); PaaS provides runtime application platforms (managed deployments); SaaS provides fully managed software.',
      'IaaS is only for storage, PaaS is only for databases, and SaaS is only for email.',
      'PaaS requires managing operating system kernel patches.',
      'There is no difference; they are marketing synonyms.'
    ],
    correctIndex: 0,
    skill: 'Cloud Computing',
    difficulty: 'beginner',
    explanation: 'The models represent decreasing levels of user infrastructure management: IaaS (compute/network), PaaS (code runtime), SaaS (end product).'
  },
  {
    id: 'cld_q2',
    question: 'In Google Cloud, what is Google Cloud Run?',
    options: [
      'A fully managed serverless compute platform that runs container images directly and autoscales from zero to thousands of instances based on traffic.',
      'A dedicated hardware bare-metal server.',
      'A database management tool for MySQL only.',
      'A client-side JavaScript bundling utility.'
    ],
    correctIndex: 0,
    skill: 'Cloud Computing',
    difficulty: 'intermediate',
    explanation: 'Cloud Run abstracts server management, automatically scaling stateless HTTP containers up and down (including scale-to-zero).'
  },
  {
    id: 'cld_q3',
    question: 'What is the purpose of a Virtual Private Cloud (VPC)?',
    options: [
      'To provide a logically isolated virtual network within a cloud provider for secure communication between cloud resources.',
      'To encrypt hard drives in a local office.',
      'To speed up consumer home internet connections.',
      'To automatically back up desktop files.'
    ],
    correctIndex: 0,
    skill: 'Cloud Computing',
    difficulty: 'intermediate',
    explanation: 'A VPC gives users granular control over IP address ranges, subnets, route tables, and network gateways in the cloud.'
  },
  {
    id: 'cld_q4',
    question: 'What does "High Availability" (HA) architecture mean in cloud engineering?',
    options: [
      'Designing systems to remain continuously operational without significant interruption by eliminating single points of failure and deploying across multiple availability zones.',
      'Running all servers on the fastest available CPU tier.',
      'Purchasing 1 Gbps internet bandwidth.',
      'Backing up databases once every month.'
    ],
    correctIndex: 0,
    skill: 'Cloud Computing',
    difficulty: 'intermediate',
    explanation: 'HA guarantees uptime via redundancy, health checks, automatic failovers, and multi-zone deployment.'
  },
  {
    id: 'cld_q5',
    question: 'What is the function of Cloud IAM (Identity and Access Management)?',
    options: [
      'To define fine-grained access control by specifying who (identity) has what access (role/permissions) to which cloud resources.',
      'To monitor CPU usage and fan speeds.',
      'To calculate the monthly dollar cost of cloud bills.',
      'To automatically generate React frontend components.'
    ],
    correctIndex: 0,
    skill: 'Cloud Computing',
    difficulty: 'beginner',
    explanation: 'IAM enforces the principle of least privilege across cloud APIs, service accounts, and enterprise users.'
  },

  // =================== 13. AWS (5 questions) ===================
  {
    id: 'aws_q1',
    question: 'What is the maximum execution timeout for an individual AWS Lambda function invocation?',
    options: [
      '15 minutes (900 seconds)',
      '1 hour',
      '30 seconds',
      'There is no timeout limit'
    ],
    correctIndex: 0,
    skill: 'AWS',
    difficulty: 'beginner',
    explanation: 'AWS Lambda functions have a hard execution limit of 15 minutes per invocation, after which the runtime terminates.'
  },
  {
    id: 'aws_q2',
    question: 'What AWS storage class is best suited for regulatory data archives accessed once every few years with retrieval times of several hours?',
    options: [
      'Amazon S3 Glacier Flexible Retrieval or Deep Archive',
      'Amazon S3 Standard',
      'Amazon EBS gp3 Volume',
      'Amazon EFS Standard'
    ],
    correctIndex: 0,
    skill: 'AWS',
    difficulty: 'intermediate',
    explanation: 'S3 Glacier Deep Archive offers the lowest cost cloud storage for long-term data retention where retrieval latency of 3-12 hours is acceptable.'
  },
  {
    id: 'aws_q3',
    question: 'What is the function of an Amazon Application Load Balancer (ALB) compared to a Network Load Balancer (NLB)?',
    options: [
      'ALB operates at Layer 7 (HTTP/HTTPS) with path-based routing; NLB operates at Layer 4 (TCP/UDP) with ultra-low latency and extreme throughput.',
      'ALB cannot terminate SSL/TLS certificates.',
      'NLB can inspect HTTP headers and cookies.',
      'ALB is only compatible with Windows servers.'
    ],
    correctIndex: 0,
    skill: 'AWS',
    difficulty: 'advanced',
    explanation: 'ALB inspects application payload headers and routing paths at Layer 7; NLB routes raw IP packets at Layer 4.'
  },
  {
    id: 'aws_q4',
    question: 'In Amazon DynamoDB, what is the significance of the Partition Key (Hash Key)?',
    options: [
      'It determines the physical storage partition where the item is stored via an internal hash function, dictating data distribution.',
      'It sorts items within a partition in ascending order.',
      'It encrypts the item attributes using AES-256.',
      'It allows queries across non-indexed attributes without scanning.'
    ],
    correctIndex: 0,
    skill: 'AWS',
    difficulty: 'advanced',
    explanation: 'DynamoDB uses the partition key value as input to a hash function to select the storage partition.'
  },
  {
    id: 'aws_q5',
    question: 'What does AWS CloudFormation allow cloud engineers to accomplish?',
    options: [
      'Model, provision, and version AWS resources using declarative JSON or YAML infrastructure-as-code (IaC) templates.',
      'Automatically write Python Lambda handler functions.',
      'Manage user passwords and reset emails.',
      'Track real-time stock prices of AWS partner companies.'
    ],
    correctIndex: 0,
    skill: 'AWS',
    difficulty: 'intermediate',
    explanation: 'CloudFormation automates provisioning and updates of entire stacks of AWS resources through declarative templates.'
  },

  // =================== 14. DOCKER (5 questions) ===================
  {
    id: 'doc_q1',
    question: 'What is the primary operational advantage of multi-stage Docker builds?',
    options: [
      'They separate compilation build tools from the final production container image, drastically reducing final image size and attack surface.',
      'They allow a container to run on multiple operating systems simultaneously.',
      'They execute Docker commands 10x faster.',
      'They eliminate the need for Dockerfiles.'
    ],
    correctIndex: 0,
    skill: 'Docker',
    difficulty: 'intermediate',
    explanation: 'Multi-stage builds leave compilers and devDependencies behind, copying only the final build artifacts into a lightweight base image.'
  },
  {
    id: 'doc_q2',
    question: 'What is the difference between a Docker Image and a Docker Container?',
    options: [
      'An image is an immutable, read-only template with instructions; a container is a runnable, isolated instance of an image with a writable layer.',
      'An image is running code while a container is stored on disk.',
      'Images run on Linux while containers run only on macOS.',
      'There is no technical difference.'
    ],
    correctIndex: 0,
    skill: 'Docker',
    difficulty: 'beginner',
    explanation: 'Images are static packages of binaries and dependencies; containers are isolated running processes spawned from images.'
  },
  {
    id: 'doc_q3',
    question: 'In a Dockerfile, what is the difference between `CMD` and `ENTRYPOINT`?',
    options: [
      '`ENTRYPOINT` specifies the executable that always runs; `CMD` provides default arguments that can be overridden by docker run CLI arguments.',
      '`CMD` runs during image build time; `ENTRYPOINT` runs during container runtime.',
      '`CMD` requires root privileges while `ENTRYPOINT` does not.',
      '`ENTRYPOINT` is only used in Windows containers.'
    ],
    correctIndex: 0,
    skill: 'Docker',
    difficulty: 'intermediate',
    explanation: 'ENTRYPOINT sets the concrete command; CMD sets default parameters that can be overridden by arguments passed to `docker run`.'
  },
  {
    id: 'doc_q4',
    question: 'Why should you avoid running containerized applications as the `root` user in production?',
    options: [
      'If an attacker escapes the container, they could gain root privileges on the underlying host operating system.',
      'The Linux kernel terminates non-root processes automatically.',
      'Docker images fail to build if root is used.',
      'Root containers consume twice as much RAM.'
    ],
    correctIndex: 0,
    skill: 'Docker',
    difficulty: 'intermediate',
    explanation: 'Running as non-root (USER directive) enforces the principle of least privilege, preventing host escalation vulnerabilities.'
  },
  {
    id: 'doc_q5',
    question: 'What is the purpose of Docker Volumes?',
    options: [
      'To persist data generated by and used by containers outside the container writable layer, surviving container destruction.',
      'To increase the audio sound volume of containerized media players.',
      'To compress Docker images into smaller tarballs.',
      'To increase CPU core allocations.'
    ],
    correctIndex: 0,
    skill: 'Docker',
    difficulty: 'beginner',
    explanation: 'Volumes exist on the host filesystem outside container layers, providing durable persistence and shared storage between containers.'
  },

  // =================== 15. DEVOPS & CI/CD (5 questions) ===================
  {
    id: 'devops_q1',
    question: 'What is the core goal of Continuous Integration (CI)?',
    options: [
      'Developers frequently merge code changes into a central repository, triggering automated builds and test suites to catch integration errors early.',
      'Deploying code directly to production servers without running tests.',
      'Eliminating the need for software developers by using AI bots.',
      'Replacing git repositories with zip backups.'
    ],
    correctIndex: 0,
    skill: 'DevOps',
    difficulty: 'beginner',
    explanation: 'CI ensures that code is verified continuously through automated builds and tests, preventing integration merge debt.'
  },
  {
    id: 'devops_q2',
    question: 'What is a "Blue-Green" deployment strategy?',
    options: [
      'Maintaining two identical production environments; new code is deployed and tested on the idle environment (Green) before switching router traffic from Blue to Green.',
      'Deploying code on odd-numbered days only.',
      'A technique where frontend is colored green and backend is colored blue.',
      'Gradually deploying code to random 10% of users.'
    ],
    correctIndex: 0,
    skill: 'DevOps',
    difficulty: 'intermediate',
    explanation: 'Blue-Green deployments eliminate downtime and enable near-instant rollback by switching router traffic between parallel production clusters.'
  },
  {
    id: 'devops_q3',
    question: 'What is Infrastructure as Code (IaC)?',
    options: [
      'Managing and provisioning computing infrastructure through machine-readable definition files (e.g. Terraform, Ansible) rather than manual console configuration.',
      'Writing JavaScript inside BIOS firmware.',
      'Printing server architecture diagrams on physical paper.',
      'Configuring production servers manually via SSH terminal.'
    ],
    correctIndex: 0,
    skill: 'DevOps',
    difficulty: 'beginner',
    explanation: 'IaC ensures repeatable, version-controlled, and auditable cloud environments that can be automated through CI/CD.'
  },
  {
    id: 'devops_q4',
    question: 'What is the role of Prometheus and Grafana in production infrastructure monitoring?',
    options: [
      'Prometheus scrapes and stores time-series numerical metrics; Grafana queries Prometheus to visualize metrics on interactive real-time dashboards.',
      'Prometheus compiles TypeScript code while Grafana runs unit tests.',
      'They act as DNS servers for external internet routing.',
      'They automatically write code documentation.'
    ],
    correctIndex: 0,
    skill: 'DevOps',
    difficulty: 'intermediate',
    explanation: 'Prometheus collects time-series telemetry (CPU, RAM, HTTP latency), and Grafana provides visual graphs and alerts for site reliability engineers.'
  },
  {
    id: 'devops_q5',
    question: 'In Site Reliability Engineering (SRE), what does the acronym "SLO" stand for?',
    options: [
      'Service Level Objective: The target level of service reliability or performance agreed upon by the engineering team (e.g., 99.9% uptime).',
      'System Load Optimization',
      'Synchronous Loop Operation',
      'Single Line Output'
    ],
    correctIndex: 0,
    skill: 'DevOps',
    difficulty: 'intermediate',
    explanation: 'An SLO sets the target boundary for measuring whether service performance is meeting user expectations.'
  },

  // =================== 16. GIT (5 questions) ===================
  {
    id: 'git_q1',
    question: 'What is the difference between `git merge` and `git rebase`?',
    options: [
      '`git merge` combines branches creating a 3-way merge commit preserving exact history; `git rebase` rewrites history by moving the entire feature branch onto the tip of the target branch.',
      '`git rebase` deletes uncommitted files from disk.',
      '`git merge` can only be executed on the main branch.',
      'There is no difference in Git 2.0+.'
    ],
    correctIndex: 0,
    skill: 'Git',
    difficulty: 'intermediate',
    explanation: 'Rebasing linearizes commit history by reapplying commits atop a new base; merging preserves branch divergence with a merge commit.'
  },
  {
    id: 'git_q2',
    question: 'How do you undo the last commit while keeping all your modified changes staged in the working directory?',
    options: [
      'git reset --soft HEAD~1',
      'git reset --hard HEAD~1',
      'git clean -fd',
      'git checkout -b new-branch'
    ],
    correctIndex: 0,
    skill: 'Git',
    difficulty: 'intermediate',
    explanation: '`--soft` resets the commit pointer without altering the staging index or working tree files.'
  },
  {
    id: 'git_q3',
    question: 'What is the purpose of `git stash`?',
    options: [
      'Temporarily shelves (stashes) uncommitted modifications so you can switch branches with a clean working directory, and reapply them later.',
      'Permanently deletes files from the remote GitHub repository.',
      'Creates a new Git tag for production releases.',
      'Compresses the Git repository into a zip file.'
    ],
    correctIndex: 0,
    skill: 'Git',
    difficulty: 'beginner',
    explanation: '`git stash` stores dirty working directory state on a stack, which can be retrieved with `git stash pop`.'
  },
  {
    id: 'git_q4',
    question: 'What does `git cherry-pick <commit-hash>` do?',
    options: [
      'Applies the changes introduced by a specific existing commit from another branch onto your current branch as a new commit.',
      'Picks the best branch according to code quality metrics.',
      'Deletes the specified commit from history.',
      'Merges all commits with the word "cherry" in the message.'
    ],
    correctIndex: 0,
    skill: 'Git',
    difficulty: 'intermediate',
    explanation: 'Cherry-picking copies the diff of a specific commit and applies it cleanly to your active HEAD.'
  },
  {
    id: 'git_q5',
    question: 'What is the `.gitignore` file used for in a project repository?',
    options: [
      'Specifying intentionally untracked files (e.g. `node_modules`, `.env`, build artifacts) that Git should not commit or track.',
      'Ignoring syntax errors in JavaScript files.',
      'Listing blocked user accounts on GitHub.',
      'Hiding code from search engines.'
    ],
    correctIndex: 0,
    skill: 'Git',
    difficulty: 'beginner',
    explanation: '.gitignore prevents local build files, dependencies, and sensitive environment secrets from being checked into source control.'
  },

  // =================== 17. UI/UX (5 questions) ===================
  {
    id: 'ui_q1',
    question: 'According to WCAG 2.1 AA accessibility guidelines, what is the minimum contrast ratio required for standard body text against its background?',
    options: [
      '4.5:1',
      '3.0:1',
      '7.0:1',
      '2.0:1'
    ],
    correctIndex: 0,
    skill: 'UI Design',
    difficulty: 'intermediate',
    explanation: 'WCAG AA requires a 4.5:1 contrast ratio for normal text (< 18pt) and 3:1 for large text (>= 18pt or 14pt bold).'
  },
  {
    id: 'ui_q2',
    question: 'What is Fitts’s Law in human-computer interaction and user interface design?',
    options: [
      'The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target.',
      'Users spend most of their time on other websites, so your site should follow common conventions.',
      'The average human can hold 7 ± 2 items in working memory.',
      'Color contrast decreases as screen size increases.'
    ],
    correctIndex: 0,
    skill: 'UI Design',
    difficulty: 'advanced',
    explanation: 'Fitts’s Law dictates that primary interactive buttons should be adequately large and placed within easy physical reach (e.g., thumb zones on mobile).'
  },
  {
    id: 'ui_q3',
    question: 'What is the primary purpose of creating a Design System (Tokens, Components, Patterns)?',
    options: [
      'To provide a single source of truth that ensures visual consistency, accessibility, and rapid engineering reuse across products.',
      'To eliminate the need for frontend developers.',
      'To ensure all web pages use the exact same paragraph text.',
      'To replace HTML and CSS with image files.'
    ],
    correctIndex: 0,
    skill: 'UI Design',
    difficulty: 'beginner',
    explanation: 'Design systems bridge design and engineering with standardized typography, spacing scales, colors, and reusable component libraries.'
  },
  {
    id: 'ui_q4',
    question: 'In UX typography, what is the recommended optimal character line length (measure) for comfortable reading?',
    options: [
      '45 to 75 characters per line (approx. 65ch)',
      '120 to 180 characters per line',
      '10 to 20 characters per line',
      'Lines should stretch 100% across the full browser width regardless of monitor size.'
    ],
    correctIndex: 0,
    skill: 'UI Design',
    difficulty: 'intermediate',
    explanation: 'Lines between 45-75 characters prevent eye strain when scanning to the next line of text.'
  },
  {
    id: 'ui_q5',
    question: 'What is the purpose of Auto Layout in Figma?',
    options: [
      'Creating dynamic frames that automatically adjust padding, spacing, and dimensions when child content changes, mirroring CSS Flexbox.',
      'Automatically generating vector 3D illustrations.',
      'Translating design layers into foreign languages.',
      'Saving files automatically to the cloud.'
    ],
    correctIndex: 0,
    skill: 'UI Design',
    difficulty: 'beginner',
    explanation: 'Figma Auto Layout provides flexbox-like responsive layouts that expand or collapse as button text or items change.'
  },

  // =================== 18. FLUTTER (5 questions) ===================
  {
    id: 'flt_q1',
    question: 'What is the difference between a `StatelessWidget` and a `StatefulWidget` in Flutter?',
    options: [
      'A `StatelessWidget` is immutable and cannot alter its state during runtime; a `StatefulWidget` creates a mutable `State` object that triggers re-builds via `setState()`.',
      '`StatelessWidget` runs only on Android; `StatefulWidget` runs only on iOS.',
      '`StatefulWidget` cannot contain child widgets.',
      '`StatelessWidget` connects directly to a database.'
    ],
    correctIndex: 0,
    skill: 'Flutter',
    difficulty: 'beginner',
    explanation: 'Stateless widgets are fixed upon construction; stateful widgets maintain mutable state across their lifecycle.'
  },
  {
    id: 'flt_q2',
    question: 'In Flutter, what is the role of the Dart programming language AOT (Ahead-of-Time) compilation?',
    options: [
      'It compiles Dart code directly into native ARM/x86 machine instructions for fast 60/120 FPS rendering without a JavaScript bridge.',
      'It translates Dart into HTML5 canvas code at runtime.',
      'It runs Dart in a browser web worker.',
      'It compresses images before app bundle creation.'
    ],
    correctIndex: 0,
    skill: 'Flutter',
    difficulty: 'intermediate',
    explanation: 'Flutter compiles AOT to native machine code in release mode, ensuring smooth 60/120 FPS graphics.'
  },
  {
    id: 'flt_q3',
    question: 'What is the core concept behind the BLoC (Business Logic Component) pattern in Flutter?',
    options: [
      'Separating business logic from UI presentation using reactive asynchronous streams of Events and States.',
      'Storing all variables in global static singletons.',
      'Writing mobile apps using raw SQL statements in widgets.',
      'Replacing Flutter widgets with React Native components.'
    ],
    correctIndex: 0,
    skill: 'Flutter',
    difficulty: 'intermediate',
    explanation: 'BLoC receives UI events through a stream sink and emits new UI states via a stream, decoupling business rules from the view tree.'
  },
  {
    id: 'flt_q4',
    question: 'What does the `BuildContext` object represent in Flutter?',
    options: [
      'A handle to the location of a widget within the overall widget tree hierarchy.',
      'The current GPS geographic location of the smartphone.',
      'The device battery percentage and screen brightness.',
      'The database authentication token.'
    ],
    correctIndex: 0,
    skill: 'Flutter',
    difficulty: 'intermediate',
    explanation: 'BuildContext defines where a widget sits in the element tree, used to look up theme, media query, and navigator state.'
  },
  {
    id: 'flt_q5',
    question: 'Why does Flutter use its own graphics engine (Impeller / Skia) to draw pixels directly to the canvas?',
    options: [
      'To guarantee pixel-perfect visual consistency across Android, iOS, Web, and Desktop without relying on OEM native UI widget implementations.',
      'To prevent the smartphone from overheating.',
      'Because Flutter cannot access operating system APIs.',
      'To bypass Apple App Store review guidelines.'
    ],
    correctIndex: 0,
    skill: 'Flutter',
    difficulty: 'advanced',
    explanation: 'By controlling every pixel directly via its own rendering pipeline, Flutter eliminates cross-platform styling discrepancies.'
  },

  // =================== 19. JAVA (5 questions) ===================
  {
    id: 'java_q1',
    question: 'What is the difference between the Stack memory and Heap memory in the Java Virtual Machine (JVM)?',
    options: [
      'Stack memory stores local primitive variables and method call frames (LIFO); Heap memory stores dynamically allocated objects and is managed by Garbage Collection.',
      'Stack memory is shared across all threads; Heap memory is private to each thread.',
      'Objects are always stored in the Stack memory.',
      'Garbage collection cleans up the Stack memory.'
    ],
    correctIndex: 0,
    skill: 'Java',
    difficulty: 'intermediate',
    explanation: 'Stack memory is thread-private for fast function execution frames; Heap memory holds all objects and is cleaned by the Garbage Collector.'
  },
  {
    id: 'java_q2',
    question: 'What is the purpose of the `volatile` keyword in Java?',
    options: [
      'It ensures that changes to a variable are always flushed to and read directly from main memory, establishing thread visibility without full locking.',
      'It prevents a class from being inherited.',
      'It makes an object serializable to disk.',
      'It converts a variable into an immutable constant.'
    ],
    correctIndex: 0,
    skill: 'Java',
    difficulty: 'advanced',
    explanation: 'The volatile keyword guarantees that all threads see the most up-to-date value written by any other thread in shared memory.'
  },
  {
    id: 'java_q3',
    question: 'What is the operational difference between `Comparable` and `Comparator` interfaces in Java?',
    options: [
      '`Comparable` defines the single natural sorting order within the object itself via `compareTo()`; `Comparator` defines external custom sorting logic via `compare()`.',
      '`Comparable` cannot be used with Strings.',
      '`Comparator` is only for sorting numbers in reverse order.',
      'They are identical and interchangeable.'
    ],
    correctIndex: 0,
    skill: 'Java',
    difficulty: 'beginner',
    explanation: 'Comparable provides default natural ordering (implemented by the class); Comparator permits multiple arbitrary sorting strategies.'
  },
  {
    id: 'java_q4',
    question: 'What do Java Streams (introduced in Java 8) allow developers to achieve?',
    options: [
      'Declarative, functional-style transformations (filter, map, reduce, collect) over sequences of elements, with optional parallel execution.',
      'Writing raw bytes directly to external USB ports.',
      'Streaming YouTube video files inside Swing desktop windows.',
      'Replacing all database tables with Java arrays.'
    ],
    correctIndex: 0,
    skill: 'Java',
    difficulty: 'intermediate',
    explanation: 'Java Streams provide high-level functional pipelines for querying and processing collections with pipeline optimizations.'
  },
  {
    id: 'java_q5',
    question: 'Why should you override both `equals()` and `hashCode()` methods together in a Java class?',
    options: [
      'To maintain the general contract: if two objects are equal according to `equals()`, they must produce the exact same integer `hashCode()`, vital for HashMap and HashSet correctness.',
      'Because Java will fail to compile if only one is overridden.',
      'To encrypt the object in memory.',
      'To convert the object into JSON automatically.'
    ],
    correctIndex: 0,
    skill: 'Java',
    difficulty: 'intermediate',
    explanation: 'Violating the hashCode contract causes hash-based collections (like HashMap) to misplace objects into wrong buckets.'
  },

  // =================== 20. SPRING BOOT (5 questions) ===================
  {
    id: 'sb_q1',
    question: 'What is Inversion of Control (IoC) and Dependency Injection (DI) in the Spring Framework?',
    options: [
      'The framework manages the creation, configuration, and lifecycle of application objects (Beans) and injects dependencies rather than the class instantiating them directly with `new`.',
      'Inverting the client and server roles so browsers act as servers.',
      'Injecting SQL queries into HTML forms.',
      'A design pattern that eliminates database transactions.'
    ],
    correctIndex: 0,
    skill: 'Spring Boot',
    difficulty: 'beginner',
    explanation: 'IoC transfers control of bean instantiation to the Spring container, which injects required dependencies via constructors or annotations.'
  },
  {
    id: 'sb_q2',
    question: 'What is the difference between `@Controller` and `@RestController` in Spring Boot?',
    options: [
      '`@RestController` is a convenience annotation that combines `@Controller` and `@ResponseBody`, automatically serializing return values directly into JSON/XML HTTP responses.',
      '`@RestController` can only handle REST GET requests, not POST or PUT.',
      '`@Controller` is only for mobile applications.',
      '`@RestController` requires manual HTML template rendering.'
    ],
    correctIndex: 0,
    skill: 'Spring Boot',
    difficulty: 'beginner',
    explanation: '@RestController returns raw JSON/XML data directly in the response body, whereas @Controller expects view template resolution (e.g. Thymeleaf).'
  },
  {
    id: 'sb_q3',
    question: 'What does the `@Transactional` annotation in Spring achieve?',
    options: [
      'It manages database transaction boundaries automatically via Spring AOP proxy, committing on successful method return and rolling back on unhandled RuntimeExceptions.',
      'It transfers money between user bank accounts.',
      'It converts HTTP requests into HTTPS SSL connections.',
      'It caches method results in Redis.'
    ],
    correctIndex: 0,
    skill: 'Spring Boot',
    difficulty: 'intermediate',
    explanation: '@Transactional wraps the method execution in a database transaction lifecycle, ensuring ACID integrity.'
  },
  {
    id: 'sb_q4',
    question: 'In Spring Data JPA, what does creating an interface extending `JpaRepository<User, Long>` provide?',
    options: [
      'Automatic out-of-the-box CRUD operations, pagination, sorting, and dynamic query derivation (e.g. `findByEmail`) without writing boilerplate implementation code.',
      'Direct connection to MongoDB without configuration.',
      'Automatic compilation of Java into C++.',
      'A graphical web admin dashboard.'
    ],
    correctIndex: 0,
    skill: 'Spring Boot',
    difficulty: 'intermediate',
    explanation: 'Spring Data JPA auto-generates proxy implementations for standard CRUD, pagination, and derived query methods at runtime.'
  },
  {
    id: 'sb_q5',
    question: 'What is the function of Spring Boot Actuator in production microservices?',
    options: [
      'Providing built-in production-ready HTTP endpoints to monitor application health (`/actuator/health`), metrics (`/actuator/metrics`), and environment configuration.',
      'Executing automated load tests on the database.',
      'Compressing JAR files before containerization.',
      'Generating mock credit card numbers for testing.'
    ],
    correctIndex: 0,
    skill: 'Spring Boot',
    difficulty: 'intermediate',
    explanation: 'Actuator exposes telemetry and health probes, essential for Kubernetes liveness and readiness checks.'
  }
];

// Group the 105 questions into organized skill assessments
export const SKILL_ASSESSMENTS_SEED = [
  {
    id: 'assm_python',
    skillId: 'sk_py',
    skillName: 'Python',
    title: 'Python Core & Advanced Systems',
    description: 'Demonstrate proficiency in Python language constructs, generators, GIL, and memory architecture.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Python')
  },
  {
    id: 'assm_ml',
    skillId: 'sk_ml',
    skillName: 'Machine Learning',
    title: 'Machine Learning & Statistical Modeling',
    description: 'Evaluate feature engineering, cross-validation, regularization, and ensemble algorithms.',
    durationMinutes: 15,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Machine Learning')
  },
  {
    id: 'assm_dl',
    skillId: 'sk_dl',
    skillName: 'Deep Learning',
    title: 'Neural Networks & PyTorch Fundamentals',
    description: 'Verify understanding of backpropagation, activation functions, optimizers, and deep architectures.',
    durationMinutes: 15,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Deep Learning')
  },
  {
    id: 'assm_nlp',
    skillId: 'sk_nlp',
    skillName: 'Natural Language Processing',
    title: 'NLP & Transformer Architectures',
    description: 'Assess knowledge of self-attention, tokenization, embeddings, and modern LLM mechanics.',
    durationMinutes: 15,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Natural Language Processing')
  },
  {
    id: 'assm_react',
    skillId: 'sk_react',
    skillName: 'React',
    title: 'Modern React Architecture & Hooks',
    description: 'Test virtual DOM reconciliation, hooks, memoization, and concurrent rendering.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'React')
  },
  {
    id: 'assm_js',
    skillId: 'sk_js',
    skillName: 'JavaScript',
    title: 'Modern JavaScript & V8 Internals',
    description: 'Demonstrate mastery of closures, event loop microtasks, async promises, and lexical scoping.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'JavaScript')
  },
  {
    id: 'assm_node',
    skillId: 'sk_node',
    skillName: 'Node.js',
    title: 'Node.js Backend & Concurrency',
    description: 'Evaluate event-driven non-blocking I/O, streams, middleware, and backend security.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Node.js')
  },
  {
    id: 'assm_mongo',
    skillId: 'sk_mongo',
    skillName: 'MongoDB',
    title: 'MongoDB Schema & Aggregations',
    description: 'Test document modeling, aggregation pipelines, indexes, and write concerns.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'MongoDB')
  },
  {
    id: 'assm_sql',
    skillId: 'sk_sql',
    skillName: 'SQL',
    title: 'Relational Database & SQL Mastery',
    description: 'Assess joins, window functions, ACID transaction isolation, and query optimization.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'SQL')
  },
  {
    id: 'assm_ds',
    skillId: 'sk_ds',
    skillName: 'Data Science',
    title: 'Applied Data Science & Statistics',
    description: 'Demonstrate proficiency in Pandas, Central Limit Theorem, p-values, and hypothesis testing.',
    durationMinutes: 15,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Data Science')
  },
  {
    id: 'assm_sec',
    skillId: 'sk_sec',
    skillName: 'Cybersecurity',
    title: 'Cybersecurity & Application Defense',
    description: 'Evaluate Zero Trust, OWASP defenses (XSS/CSRF), and cryptographic fundamentals.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Cybersecurity')
  },
  {
    id: 'assm_cloud',
    skillId: 'sk_cloud',
    skillName: 'Cloud Computing',
    title: 'Cloud Architecture & Google Cloud',
    description: 'Assess VPC networks, Cloud Run serverless, IAM, and high availability systems.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Cloud Computing')
  },
  {
    id: 'assm_aws',
    skillId: 'sk_aws',
    skillName: 'AWS',
    title: 'AWS Cloud Engineering',
    description: 'Verify Lambda serverless limits, S3 tiers, DynamoDB partition keys, and ALB routing.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'AWS')
  },
  {
    id: 'assm_docker',
    skillId: 'sk_docker',
    skillName: 'Docker',
    title: 'Containerization & Dockerfile Best Practices',
    description: 'Evaluate multi-stage builds, non-root security, volume mounts, and container lifecycles.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Docker')
  },
  {
    id: 'assm_devops',
    skillId: 'sk_devops',
    skillName: 'DevOps',
    title: 'CI/CD Pipelines & Site Reliability',
    description: 'Test continuous integration, Blue-Green deployments, IaC, and monitoring telemetry.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'DevOps')
  },
  {
    id: 'assm_git',
    skillId: 'sk_git',
    skillName: 'Git',
    title: 'Git Version Control & Workflows',
    description: 'Assess merge vs rebase, soft resets, stashing, and cherry-picking mechanics.',
    durationMinutes: 10,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Git')
  },
  {
    id: 'assm_ui',
    skillId: 'sk_ui',
    skillName: 'UI Design',
    title: 'UI/UX Design Systems & Accessibility',
    description: 'Demonstrate WCAG AA contrast standards, Fitts’s Law, line measure, and Auto Layout.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'UI Design')
  },
  {
    id: 'assm_flutter',
    skillId: 'sk_flutter',
    skillName: 'Flutter',
    title: 'Cross-Platform Mobile with Flutter & Dart',
    description: 'Verify stateful widget lifecycles, BLoC architecture, Dart AOT, and rendering mechanics.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Flutter')
  },
  {
    id: 'assm_java',
    skillId: 'sk_java',
    skillName: 'Java',
    title: 'Core Java & JVM Architecture',
    description: 'Evaluate JVM memory regions (Heap/Stack), volatile visibility, Streams, and hashCode contracts.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Java')
  },
  {
    id: 'assm_sb',
    skillId: 'sk_sb',
    skillName: 'Spring Boot',
    title: 'Spring Boot Microservices & JPA',
    description: 'Assess Inversion of Control, @Transactional semantics, Spring Data JPA, and Actuator.',
    durationMinutes: 12,
    passingScore: 70,
    questions: QUESTION_BANK.filter(q => q.skill === 'Spring Boot')
  }
];
