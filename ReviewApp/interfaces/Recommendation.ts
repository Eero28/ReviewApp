import { ReviewItemIf } from "./ReviewItemIf";

export interface RecommendationSuggestion {
    review: ReviewItemIf;
    similarityScore: number;
}


