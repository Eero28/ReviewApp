import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { ReviewService } from 'src/review/review.service';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class TensorflowService implements OnModuleInit {
  private useModel: any;

  constructor(private readonly reviewService: ReviewService) {}

  private async loadModel() {
    this.useModel = await use.load();
    console.log('Universal Sentence Encoder model loaded');
  }

  async onModuleInit() {
    await this.loadModel();
  }

  private async getReviewEmbedding(review: Review) {
    // Combine review name, description, and category into a single text
    const combinedText = `${review.reviewname} ${review.reviewDescription} ${review.category}`;
    const embeddings = await this.useModel.embed([combinedText]);
    return embeddings;
  }

  private calculateCosineSimilarity(embedding1: tf.Tensor, embedding2: tf.Tensor) {
    const dotProduct = tf.matMul(embedding1, embedding2, false, true);
    const norm1 = tf.norm(embedding1, 'euclidean');
    const norm2 = tf.norm(embedding2, 'euclidean');
    const cosineSimilarity = dotProduct.div(norm1.mul(norm2));

    const similarity = Math.max(-1, Math.min(1, cosineSimilarity.dataSync()[0]));
    return similarity * 100; // Return similarity as a percentage
  }

  private async calculateSimilarity(userReviews: Review[], review: Review): Promise<number> {
    const userReviewEmbeddings = await Promise.all(
      userReviews.map((userReview) => this.getReviewEmbedding(userReview))
    );
    const reviewEmbedding = await this.getReviewEmbedding(review);

    const similarities = userReviewEmbeddings.map((userReviewEmbedding) =>
      this.calculateCosineSimilarity(userReviewEmbedding, reviewEmbedding)
    );

    return similarities.reduce((acc, sim) => acc + sim, 0) / similarities.length;
  }

  private adjustScoreBasedOnAdditionalFactors(review: Review, similarityScore: number): number {
    const ratingWeight = review.reviewRating / 5;
    const ratingScore = ratingWeight * 0.2;

    const daysSinceReview = (new Date().getTime() - new Date(review.createdAt).getTime()) / (1000 * 3600 * 24);
    const recencyFactor = Math.exp(-daysSinceReview / 30);

    const likesWeight = review.likes ? review.likes.length : 0;
    const commentsWeight = review.comments ? review.comments.length : 0;

    let adjustedScore = similarityScore + ratingScore + (recencyFactor * 0.1) + (likesWeight * 0.05) + (commentsWeight * 0.05);
    return Math.min(adjustedScore, 100);
  }

  async recommendInterestingReviews(id_user: number): Promise<any> {
    try {
      // Fetch user reviews
      const userReviews = await this.reviewService.getUserReviewsByid(id_user);
  
      if (!userReviews || userReviews.length === 0) {
        console.log('No reviews found for this user.');
        return [];
      }
  
      // Identify all categories the user has reviewed
      const categoriesReviewed = userReviews.map(review => review.category);
      const uniqueCategories = [...new Set(categoriesReviewed)]; 
  
      // Recommend reviews based on these categories
      const recommendations: any[] = [];
  
      for (const category of uniqueCategories) {
        // Fetch all reviews in this category
        const allCategoryReviews = await this.reviewService.getReviewsByCategory(category);
  
        if (!allCategoryReviews || allCategoryReviews.length === 0) {
          console.log(`No reviews found for the category: ${category}`);
          continue;
        }
  
       // Filter out the user's own reviews from the same category
        const reviewsExcludingUser = allCategoryReviews.filter(review => review.user.id_user !== id_user);
  
        console.log(`Excluding reviews by user with ID ${id_user}. Found ${reviewsExcludingUser.length} reviews.`);
  
        // Calculate similarity for all the reviews
        const rankedReviews = await Promise.all(
          reviewsExcludingUser.map(async (review) => {
            const similarityScore = await this.calculateSimilarity(userReviews, review);
            const adjustedSimilarityScore = this.adjustScoreBasedOnAdditionalFactors(review, similarityScore);
            return { review, adjustedSimilarityScore };
          })
        );
  
        // Sort and return the top reviews in the current category
        rankedReviews.sort((a, b) => b.adjustedSimilarityScore - a.adjustedSimilarityScore);
  
        recommendations.push(...rankedReviews.slice(0, 5));
      }
  
      // Return the top 5 recommended reviews across all categories
      recommendations.sort((a, b) => b.adjustedSimilarityScore - a.adjustedSimilarityScore);
      const top5Reviews = recommendations.slice(0, 5).map(item => ({
        review: item.review,
        similarityScore: item.adjustedSimilarityScore,
      }));
  
      return top5Reviews;
    } catch (error) {
      console.error('Error during recommendation calculation:', error);
      return [];
    }
  }
}
