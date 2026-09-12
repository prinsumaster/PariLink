import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { tripService } from '@/services/trips';
import { useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TripReview {
  id: string;
  reviewerRole: 'DISPATCHER' | 'LOADER' | 'SAFETY_OFFICER' | 'UNLOADER' | 'FLEET_MANAGER';
  rating: number;
  comment?: string;
  createdAt: string;
}

interface TripReviewsPanelProps {
  tripId: string;
  reviews?: TripReview[];
}

const ROLES = ['DISPATCHER', 'LOADER', 'SAFETY_OFFICER', 'UNLOADER', 'FLEET_MANAGER'] as const;

export function TripReviewsPanel({ tripId, reviews = [] }: TripReviewsPanelProps) {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error('Please select a reviewer role');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await tripService.submitReview(tripId, {
        reviewerRole: selectedRole as any,
        rating,
        comment,
      });
      toast.success('Review submitted successfully');
      setSelectedRole('');
      setComment('');
      setRating(5);
      // Invalidate the trip query to refresh reviews
      queryClient.invalidateQueries({ queryKey: ['trip', tripId] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guarded array and mapping
  const existingReviews = Array.isArray(reviews) ? reviews : [];
  
  // Guarded map to render review status for all 5 roles
  const roleStatuses = ROLES.map(role => {
    const existing = existingReviews.find(r => r.reviewerRole === role);
    return {
      role,
      isCompleted: !!existing,
      review: existing
    };
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Trip Reviews & Driver Score Workflow
          <Badge variant="outline" className="ml-2">
            {existingReviews.length} / 5 Completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Roles Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-500">Review Status</h3>
            <div className="space-y-3">
              {roleStatuses.map(({ role, isCompleted, review }) => (
                <div key={role} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                    )}
                    <span className="font-medium text-sm">{role.replace('_', ' ')}</span>
                  </div>
                  {isCompleted && review && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {existingReviews.length === 5 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300">
                <p className="font-medium">All reviews completed.</p>
                <p className="text-sm mt-1">Driver score has been calculated and applied.</p>
              </div>
            )}
          </div>

          {/* Right Column: Submit Form */}
          <div>
            <h3 className="font-semibold text-sm text-gray-500 mb-4">Submit New Review</h3>
            {existingReviews.length < 5 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v || '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.filter(r => !existingReviews.some(er => er.reviewerRole === r)).map(role => (
                        <SelectItem key={role} value={role}>{role.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rating ({rating}/5)</Label>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className={`p-1 focus:outline-none ${i < rating ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-700'}`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Comment (Optional)</Label>
                  <Textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment about the trip..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || !selectedRole}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center text-slate-500 border border-dashed rounded-lg">
                No further reviews required.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
