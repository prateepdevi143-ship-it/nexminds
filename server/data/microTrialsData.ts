import {
  MicroTrial,
  MicroTrialSubmission,
  MicroTrialEvaluation
} from '../../src/types';

export const INITIAL_MICRO_TRIALS: MicroTrial[] = [
  {
    id: 'trial_ml_01',
    companyId: 'comp_01',
    companyName: 'NeuralScale AI',
    jobId: 'job_01',
    jobTitle: 'Junior ML Engineer',
    title: 'Build ML Inference & Model Evaluation Pipeline for Customer Churn',
    description: 'Implement a production-grade inference service function that validates incoming JSON payloads, generates churn probability scores, and calculates threshold-based classification metrics.',
    trialType: 'ai_ml',
    difficulty: 'Intermediate',
    timeLimitMinutes: 45,
    requiredSkills: ['Python', 'Machine Learning', 'FastAPI', 'Pandas', 'Model Evaluation'],
    preferredSkills: ['Scikit-Learn', 'NumPy', 'Docker'],
    taskInstructions: `### Practical Task Requirements:
1. **Payload Ingestion & Validation**: Define a function \`predict_churn(customers_df, model_weights, threshold=0.5)\` that validates numeric column ranges (e.g. \`tenure\`, \`monthly_charges\`, \`support_tickets\`).
2. **Probability Computation**: Apply sigmoid-based logistic weights to compute individual customer churn probabilities.
3. **Threshold Decision**: Output binary predictions \`0\` (Retained) or \`1\` (Churned) based on the supplied threshold.
4. **Metrics Evaluation**: Implement \`calculate_evaluation_metrics(y_true, y_pred)\` returning Precision, Recall, and F1-Score.
5. **Robust Error Handling**: Handle empty DataFrames, missing columns, and division-by-zero gracefully with structured errors.`,
    starterCode: `import numpy as np
import pandas as pd
from typing import Dict, Any, List

def predict_churn(
    customers_df: pd.DataFrame,
    weights: Dict[str, float],
    bias: float = -0.5,
    threshold: float = 0.5
) -> Dict[str, Any]:
    """
    Computes churn probabilities and binary decisions.
    
    Args:
        customers_df: DataFrame containing ['tenure', 'monthly_charges', 'support_tickets']
        weights: Dictionary mapping feature name to float coefficient
        bias: Model intercept term
        threshold: Decision threshold (default: 0.5)
        
    Returns:
        Dictionary with 'probabilities', 'predictions', and 'summary_stats'
    """
    if customers_df.empty:
        raise ValueError("Input DataFrame is empty")
        
    required_cols = ['tenure', 'monthly_charges', 'support_tickets']
    for col in required_cols:
        if col not in customers_df.columns:
            raise KeyError(f"Missing required feature column: {col}")
            
    # TODO: 1. Calculate linear combination: z = w1*x1 + w2*x2 + ... + bias
    # TODO: 2. Compute sigmoid probability: 1 / (1 + exp(-z))
    # TODO: 3. Apply threshold to produce binary predictions (0 or 1)
    
    return {
        "status": "success",
        "probabilities": [],
        "predictions": []
    }

def calculate_evaluation_metrics(y_true: List[int], y_pred: List[int]) -> Dict[str, float]:
    """
    Calculates precision, recall, and f1_score.
    """
    # TODO: Calculate TP, FP, FN and return metrics dictionary
    pass
`,
    inputFiles: [
      {
        name: 'sample_customers.json',
        content: `[
  {"id": "cust_101", "tenure": 12, "monthly_charges": 65.5, "support_tickets": 3},
  {"id": "cust_102", "tenure": 48, "monthly_charges": 29.0, "support_tickets": 0},
  {"id": "cust_103", "tenure": 3, "monthly_charges": 89.2, "support_tickets": 5}
]`,
        description: 'Sample batch customer dataset for verification'
      }
    ],
    expectedOutput: 'Function returns dictionary with array of float probabilities [0.0 - 1.0], binary predictions [0, 1], and validation metrics with Precision >= 0.80.',
    evaluationCriteria: [
      'Mathematical correctness of sigmoid inference & vectorization',
      'Correct precision/recall/F1 edge-case calculations',
      'Clean input validation and exception raising',
      'Execution speed and vectorization efficiency'
    ],
    testCases: [
      { id: 'tc_1', name: 'Valid customer batch calculation', input: 'sample_customers.json', expectedOutput: 'len(probabilities) == 3' },
      { id: 'tc_2', name: 'Empty DataFrame raises ValueError', input: 'pd.DataFrame()', expectedOutput: 'ValueError' },
      { id: 'tc_3', name: 'Missing columns raises KeyError', input: 'DataFrame without support_tickets', expectedOutput: 'KeyError' }
    ],
    maxAttempts: 3,
    allowedTechnologies: ['Python', 'Pandas', 'NumPy', 'FastAPI'],
    submissionType: 'code',
    aiEvaluationEnabled: true,
    manualReviewRequired: false,
    status: 'published',
    createdAt: '2026-03-01T10:00:00Z',
    matchImprovementEstimate: 12
  },
  {
    id: 'trial_backend_01',
    companyId: 'comp_02',
    companyName: 'FinEdge Labs',
    jobId: 'job_02',
    jobTitle: 'Junior Backend Developer',
    title: 'High-Throughput Protected REST API with Express & JWT Verification',
    description: 'Construct a resilient, secure Node.js / Express endpoint for payment verification with header token parsing, schema sanitization, and structured HTTP error responses.',
    trialType: 'coding',
    difficulty: 'Intermediate',
    timeLimitMinutes: 40,
    requiredSkills: ['Node.js', 'Express.js', 'REST API', 'MongoDB', 'Authentication'],
    preferredSkills: ['TypeScript', 'Jest', 'Redis'],
    taskInstructions: `### Practical Task Requirements:
1. **JWT Verification Middleware**: Inspect \`Authorization: Bearer <token>\`. Verify token payload and reject malformed/expired tokens with 401 Unauthorized.
2. **Request Validation**: Enforce that \`amount\` is a positive number, \`currency\` is an ISO string, and \`recipientId\` is a valid UUID.
3. **Idempotency Check**: Simulate checking an idempotency key to prevent double charging.
4. **Structured Error Contract**: Ensure all error responses return \`{ error: { code: string, message: string, timestamp: string } }\`.`,
    starterCode: `const express = require('express');
const router = express.Router();

// Middleware: Authenticate JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Bearer token missing' }
    });
  }
  
  // TODO: Verify token signature and attach req.user
  next();
}

// POST /api/transactions
router.post('/transactions', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, recipientId, idempotencyKey } = req.body;
    
    // TODO: 1. Validate required fields
    // TODO: 2. Check for negative amount
    // TODO: 3. Simulate atomic transaction processing
    
    return res.status(201).json({
      success: true,
      transactionId: 'tx_' + Date.now(),
      status: 'CONFIRMED'
    });
  } catch (err) {
    return res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: err.message }
    });
  }
});

module.exports = router;`,
    expectedOutput: 'Router handles valid payloads with HTTP 201, invalid tokens with HTTP 401, and invalid payloads with HTTP 400 and structured JSON.',
    evaluationCriteria: [
      'Strict adherence to HTTP status codes (201, 400, 401, 500)',
      'Secure token extraction without uncaught crashes',
      'Input sanitization against injection / negative numbers',
      'Production code readability and clean error propagation'
    ],
    testCases: [
      { id: 'tc_1', name: 'Valid transaction returns 201', input: '{"amount": 100, "currency": "USD", "recipientId": "uuid-1"}', expectedOutput: 'status: 201' },
      { id: 'tc_2', name: 'Missing token returns 401', input: 'No Auth Header', expectedOutput: 'status: 401' },
      { id: 'tc_3', name: 'Negative amount returns 400', input: '{"amount": -50}', expectedOutput: 'status: 400' }
    ],
    maxAttempts: 3,
    allowedTechnologies: ['Node.js', 'Express.js', 'JavaScript', 'TypeScript'],
    submissionType: 'code',
    aiEvaluationEnabled: true,
    manualReviewRequired: false,
    status: 'published',
    createdAt: '2026-03-02T11:00:00Z',
    matchImprovementEstimate: 10
  },
  {
    id: 'trial_react_01',
    companyId: 'comp_03',
    companyName: 'NextCloud Solutions',
    jobId: 'job_03',
    jobTitle: 'Frontend Developer',
    title: 'Interactive Real-Time Cluster Health Heatmap in React',
    description: 'Build a responsive, accessible React component that renders a 24-hour node status heatmap with hover tooltip inspection and status filters.',
    trialType: 'frontend',
    difficulty: 'Intermediate',
    timeLimitMinutes: 35,
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Component Design'],
    preferredSkills: ['Accessibility', 'State Management'],
    taskInstructions: `### Practical Task Requirements:
1. **Component State**: Render a grid of server nodes with states: \`HEALTHY\` (Emerald), \`DEGRADED\` (Amber), \`CRITICAL\` (Rose).
2. **Interactive Inspection**: Hovering over any cell displays a tooltip with latency, CPU usage %, and timestamp.
3. **Filtering**: Add toggle buttons to filter the grid by status (\`All\`, \`Only Incidents\`).
4. **Accessibility**: Implement proper ARIA attributes (\`aria-label\`, \`role="grid"\`) and keyboard navigation support.`,
    starterCode: `import React, { useState, useMemo } from 'react';

export interface NodeStatus {
  id: string;
  name: string;
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  cpuPercent: number;
  latencyMs: number;
  updatedAt: string;
}

export const ClusterHeatmap: React.FC<{ nodes: NodeStatus[] }> = ({ nodes }) => {
  const [filter, setFilter] = useState<'ALL' | 'INCIDENTS'>('ALL');
  const [hoveredNode, setHoveredNode] = useState<NodeStatus | null>(null);

  const filteredNodes = useMemo(() => {
    if (filter === 'INCIDENTS') {
      return nodes.filter(n => n.status !== 'HEALTHY');
    }
    return nodes;
  }, [nodes, filter]);

  // TODO: Implement interactive grid layout with status badges, tooltips, and accessibility
  return (
    <div className="p-4 border rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Cluster Health Monitor</h3>
        {/* TODO: Add filter controls */}
      </div>
      
      {/* TODO: Render interactive heatmap cells */}
    </div>
  );
};`,
    expectedOutput: 'Accessible React component rendering responsive grid with clean Tailwind color mapping and interactive hover state.',
    evaluationCriteria: [
      'Component composition and TypeScript typing',
      'Appropriate responsive layout with Tailwind CSS',
      'Memoization and state performance',
      'Keyboard accessibility and ARIA roles'
    ],
    maxAttempts: 3,
    allowedTechnologies: ['React', 'TypeScript', 'Tailwind CSS'],
    submissionType: 'code',
    aiEvaluationEnabled: true,
    manualReviewRequired: false,
    status: 'published',
    createdAt: '2026-03-03T09:30:00Z',
    matchImprovementEstimate: 9
  },
  {
    id: 'trial_docker_01',
    companyId: 'comp_01',
    companyName: 'NeuralScale AI',
    jobId: 'job_04',
    jobTitle: 'Cloud & DevOps Engineer',
    title: 'Multi-Stage Production Dockerfile & Health Probe Automation',
    description: 'Construct an enterprise-grade multi-stage Dockerfile for a Node.js microservice ensuring minimal image footprint, unprivileged user security, and automated health checks.',
    trialType: 'coding',
    difficulty: 'Intermediate',
    timeLimitMinutes: 30,
    requiredSkills: ['Docker', 'Linux', 'CI/CD', 'Containerization'],
    preferredSkills: ['Security', 'Bash'],
    taskInstructions: `### Practical Task Requirements:
1. **Multi-Stage Build**: Stage 1 (Builder) installs full build dependencies and builds assets; Stage 2 (Runner) only copies production artifacts.
2. **Least Privilege**: Avoid running as \`root\`. Create or switch to a non-root user (e.g. \`node\` or \`appuser\`).
3. **Image Optimization**: Leverage \`.dockerignore\` awareness and eliminate temporary caches (\`--no-cache\` / \`npm prune --production\`).
4. **Healthcheck Directive**: Implement \`HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl -f http://localhost:3000/health || exit 1\`.`,
    starterCode: `# STAGE 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# TODO: Copy package files and install dependencies
# TODO: Copy source code and build

# STAGE 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# TODO: 1. Configure non-root user
# TODO: 2. Copy artifacts from builder
# TODO: 3. Configure HEALTHCHECK
# TODO: 4. Define EXPOSE and CMD entry point`,
    expectedOutput: 'Clean multi-stage Dockerfile with non-root security, minimal layers, and valid HEALTHCHECK definition.',
    evaluationCriteria: [
      'Effective layer caching and multi-stage separation',
      'Security hardening with non-root execution',
      'Proper container signal handling and HEALTHCHECK',
      'Alpine package cleanup best practices'
    ],
    maxAttempts: 3,
    allowedTechnologies: ['Docker', 'Linux', 'DevOps'],
    submissionType: 'code',
    aiEvaluationEnabled: true,
    manualReviewRequired: false,
    status: 'published',
    createdAt: '2026-03-04T14:00:00Z',
    matchImprovementEstimate: 11
  },
  {
    id: 'trial_sql_01',
    companyId: 'comp_04',
    companyName: 'HealthAI Diagnostics',
    jobId: 'job_05',
    jobTitle: 'Data Analyst',
    title: 'Analytical Window Queries & Patient Cohort Retention in PostgreSQL',
    description: 'Formulate advanced analytical SQL queries utilizing window functions, rolling moving averages, and cohort retention matrices.',
    trialType: 'sql',
    difficulty: 'Intermediate',
    timeLimitMinutes: 35,
    requiredSkills: ['SQL', 'PostgreSQL', 'Data Aggregation', 'Query Optimization'],
    preferredSkills: ['Database Indexing', 'ETL'],
    taskInstructions: `### Practical Task Requirements:
1. **Window Aggregation**: Calculate the 7-day rolling average of daily hospital admissions partitioned by medical department.
2. **Cohort Retention**: Compute month-over-month retention percentage for new patient checkups.
3. **Anomaly Flags**: Add a calculated column flagging any day where admission count exceeds 2 standard deviations above the 30-day department mean.
4. **Query Performance**: Write clean CTEs (Common Table Expressions) and avoid Cartesian joins.`,
    starterCode: `-- Schema context:
-- admissions (id UUID, patient_id UUID, department_id VARCHAR, admission_date DATE, discharge_date DATE)

WITH daily_department_admissions AS (
  SELECT
    department_id,
    admission_date,
    COUNT(id) AS daily_count
  FROM admissions
  GROUP BY department_id, admission_date
),

-- TODO: 1. Calculate 7-day rolling average using OVER (PARTITION BY ... ORDER BY ... ROWS BETWEEN ...)
rolling_stats AS (
  SELECT
    department_id,
    admission_date,
    daily_count
    -- TODO: Add rolling average calculation
  FROM daily_department_admissions
)

-- TODO: 2. Query final result with anomaly flag
SELECT * FROM rolling_stats
ORDER BY department_id, admission_date DESC;`,
    expectedOutput: 'Syntactically valid PostgreSQL query utilizing Window functions with partition clauses, rolling boundaries, and CASE condition flags.',
    evaluationCriteria: [
      'Correct SQL window clause syntax (ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)',
      'Proper partitioning by department',
      'Clean CTE readability and query execution plan awareness',
      'Accurate mathematical edge-case handling for nulls'
    ],
    maxAttempts: 3,
    allowedTechnologies: ['SQL', 'PostgreSQL'],
    submissionType: 'code',
    aiEvaluationEnabled: true,
    manualReviewRequired: false,
    status: 'published',
    createdAt: '2026-03-05T08:00:00Z',
    matchImprovementEstimate: 10
  }
];

export const INITIAL_MICRO_TRIAL_SUBMISSIONS: MicroTrialSubmission[] = [
  {
    id: 'sub_demo_01',
    trialId: 'trial_ml_01',
    trialTitle: 'Build ML Inference & Model Evaluation Pipeline for Customer Churn',
    candidateId: 'student_01',
    studentName: 'Arjun Kumar',
    studentEmail: 'arjun.kumar@gmail.com',
    jobId: 'job_01',
    jobTitle: 'Junior ML Engineer',
    companyId: 'comp_01',
    companyName: 'NeuralScale AI',
    submittedAt: '2026-03-05T14:32:00Z',
    executionTimeSeconds: 1420,
    attemptNumber: 1,
    submissionType: 'code',
    content: `import numpy as np
import pandas as pd
from typing import Dict, Any, List

def predict_churn(
    customers_df: pd.DataFrame,
    weights: Dict[str, float],
    bias: float = -0.5,
    threshold: float = 0.5
) -> Dict[str, Any]:
    if customers_df.empty:
        raise ValueError("Input DataFrame is empty")
        
    required_cols = ['tenure', 'monthly_charges', 'support_tickets']
    for col in required_cols:
        if col not in customers_df.columns:
            raise KeyError(f"Missing required feature column: {col}")
            
    # Vectorized linear combination
    z = np.full(len(customers_df), bias, dtype=float)
    for col, w in weights.items():
        if col in customers_df.columns:
            z += customers_df[col].values * w
            
    # Sigmoid activation
    probs = 1.0 / (1.0 + np.exp(-np.clip(z, -250, 250)))
    preds = (probs >= threshold).astype(int).tolist()
    
    return {
        "status": "success",
        "probabilities": [round(float(p), 4) for p in probs],
        "predictions": preds,
        "summary_stats": {
            "total": len(customers_df),
            "churn_count": int(sum(preds)),
            "churn_rate": round(float(np.mean(preds)), 4)
        }
    }

def calculate_evaluation_metrics(y_true: List[int], y_pred: List[int]) -> Dict[str, float]:
    y_t = np.array(y_true)
    y_p = np.array(y_pred)
    
    tp = np.sum((y_t == 1) & (y_p == 1))
    fp = np.sum((y_t == 0) & (y_p == 1))
    fn = np.sum((y_t == 1) & (y_p == 0))
    tn = np.sum((y_t == 0) & (y_p == 0))
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4)
    }`,
    repositoryUrl: 'https://github.com/arjunkumar-dev/customer-churn-inference-api',
    status: 'completed',
    evaluationStatus: 'completed',
    evaluationId: 'eval_demo_01',
    integritySignals: {
      tabSwitches: 1,
      fullscreenExits: 0,
      pasteEvents: 2,
      riskLevel: 'low',
      notes: 'Natural typing cadence and smooth continuous development.'
    }
  },
  {
    id: 'sub_demo_02',
    trialId: 'trial_backend_01',
    trialTitle: 'High-Throughput Protected REST API with Express & JWT Verification',
    candidateId: 'student_02',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@gmail.com',
    jobId: 'job_02',
    jobTitle: 'Junior Backend Developer',
    companyId: 'comp_02',
    companyName: 'FinEdge Labs',
    submittedAt: '2026-03-06T09:15:00Z',
    executionTimeSeconds: 1680,
    attemptNumber: 1,
    submissionType: 'code',
    content: `const express = require('express');
const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Bearer token missing' }
    });
  }
  // Mock verification
  if (token === 'invalid_token') {
    return res.status(403).json({ error: { code: 'INVALID_TOKEN', message: 'Forbidden' } });
  }
  req.user = { id: 'usr_verified' };
  next();
}

router.post('/transactions', authenticateToken, (req, res) => {
  const { amount, currency, recipientId } = req.body;
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: { code: 'INVALID_AMOUNT', message: 'Amount must be positive' } });
  }
  if (!currency || !recipientId) {
    return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: 'Currency and recipient required' } });
  }
  return res.status(201).json({
    success: true,
    transactionId: 'tx_' + Date.now(),
    status: 'CONFIRMED'
  });
});

module.exports = router;`,
    status: 'completed',
    evaluationStatus: 'completed',
    evaluationId: 'eval_demo_02',
    integritySignals: {
      tabSwitches: 2,
      fullscreenExits: 0,
      pasteEvents: 1,
      riskLevel: 'low'
    }
  }
];

export const INITIAL_MICRO_TRIAL_EVALUATIONS: MicroTrialEvaluation[] = [
  {
    id: 'eval_demo_01',
    submissionId: 'sub_demo_01',
    trialId: 'trial_ml_01',
    trialTitle: 'Build ML Inference & Model Evaluation Pipeline for Customer Churn',
    candidateId: 'student_01',
    studentName: 'Arjun Kumar',
    jobId: 'job_01',
    jobTitle: 'Junior ML Engineer',
    overallScore: 88,
    proofOfWorkScore: 88,
    proofOfWorkBreakdown: {
      correctness: 92,
      taskCompletion: 88,
      problemSolving: 86,
      codeQuality: 85,
      technicalReasoning: 88,
      proofOfWorkScore: 88
    },
    skillScores: {
      'Python': 94,
      'Machine Learning': 90,
      'FastAPI': 84,
      'Pandas': 91,
      'Model Evaluation': 89
    },
    passed: true,
    strengths: [
      'Excellent vectorization with NumPy clips preventing arithmetic overflow',
      'Comprehensive error raising for empty datasets and missing columns',
      'Clean separation of evaluation metrics with safe division handling'
    ],
    weaknesses: [
      'Could incorporate type annotations for NumPy ndarrays',
      'Consider adding configurable logit calibration parameters'
    ],
    qualitativeFeedback: 'Outstanding practical execution. The candidate demonstrated high production maturity by preventing numerical instability with np.clip, validating DataFrame schemas upfront, and structuring clean evaluation metrics.',
    deterministicResults: [
      { check: 'Submission Completeness & Non-Empty Artifact', passed: true, details: 'Provided 52 lines of robust vectorized Python code.', score: 100 },
      { check: 'Tech Stack & API Alignment', passed: true, details: 'Implemented required Pandas, NumPy, and classification algorithms.', score: 95 },
      { check: 'Production Robustness & Error Handling', passed: true, details: 'Handled zero division and empty DataFrame validation.', score: 95 },
      { check: 'Test Suite Execution (3 Verification Checks)', passed: true, details: 'Passed all 3 verification checks.', score: 100 }
    ],
    evaluatedAt: '2026-03-05T14:35:00Z',
    evaluatorType: 'hybrid',
    recommendedActions: [
      'Direct interview fast-track approved',
      'Verified Machine Learning and Python Proof-of-Work badge issued'
    ],
    matchScoreBefore: 74,
    matchScoreAfter: 86,
    matchImprovement: 12
  },
  {
    id: 'eval_demo_02',
    submissionId: 'sub_demo_02',
    trialId: 'trial_backend_01',
    trialTitle: 'High-Throughput Protected REST API with Express & JWT Verification',
    candidateId: 'student_02',
    studentName: 'Priya Sharma',
    jobId: 'job_02',
    jobTitle: 'Junior Backend Developer',
    overallScore: 78,
    proofOfWorkScore: 78,
    proofOfWorkBreakdown: {
      correctness: 80,
      taskCompletion: 80,
      problemSolving: 75,
      codeQuality: 78,
      technicalReasoning: 75,
      proofOfWorkScore: 78
    },
    skillScores: {
      'Node.js': 82,
      'Express.js': 85,
      'REST API': 80,
      'MongoDB': 70,
      'Authentication': 76
    },
    passed: true,
    strengths: [
      'Correct HTTP status codes implemented for authentication and bad requests',
      'Input validation checks for positive numeric amounts'
    ],
    weaknesses: [
      'Simulated token check could be replaced with real jwt.verify library call',
      'Missing async database persistence hook'
    ],
    qualitativeFeedback: 'Good solid implementation of the Express router. Handles authentication guard middleware and positive amount constraints cleanly.',
    deterministicResults: [
      { check: 'Submission Completeness & Non-Empty Artifact', passed: true, details: 'Provided complete Express router implementation.', score: 85 },
      { check: 'Tech Stack & API Alignment', passed: true, details: 'Matches Node.js and Express REST paradigms.', score: 80 },
      { check: 'Production Robustness & Error Handling', passed: true, details: 'Structured error objects returned with status codes.', score: 85 },
      { check: 'Test Suite Execution (3 Verification Checks)', passed: true, details: 'Passed 2 of 3 automated test cases.', score: 75 }
    ],
    evaluatedAt: '2026-03-06T09:18:00Z',
    evaluatorType: 'hybrid',
    recommendedActions: [
      'Candidate is pending recruiter review in candidate dashboard',
      'Ready for technical interview round'
    ],
    matchScoreBefore: 70,
    matchScoreAfter: 80,
    matchImprovement: 10
  }
];
