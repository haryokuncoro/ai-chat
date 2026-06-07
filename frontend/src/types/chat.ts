export interface ChatRequest {
  sessionId: string;
  provider: string;
  model: string;
  mode: "CHAT" | "CODE_REVIEW";
  prompt: string;
}

export interface ReviewFinding {
  severity: string;
  message: string;
}

export interface CodeReviewResponse {
  summary: string;
  findings: ReviewFinding[];
}

export interface CodeReviewRequest {
  sessionId: string;
  provider: string;
  title: string;
  code: string;
}