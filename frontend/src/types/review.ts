export interface ReviewFinding {
  severity: string;
  message: string;
}

export interface CodeReviewResponse {
  summary: string;
  findings: ReviewFinding[];
}