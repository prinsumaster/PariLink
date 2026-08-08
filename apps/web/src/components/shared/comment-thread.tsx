'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';

interface CommentAuthor {
  id: string;
  firstName: string;
  lastName: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  replies?: Comment[];
}

interface CommentThreadProps {
  entityType: string;
  entityId: string;
}

export function CommentThread({ entityType, entityId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/${entityType}/${entityId}`);
      // Filter out replies from top level
      const rootComments = response.data.filter((c: any) => !c.parentId);
      setComments(rootComments);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [entityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/comments/${entityType}/${entityId}`, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to post comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <MessageSquare className="h-5 w-5 text-indigo-500" />
        <h3 className="font-medium text-slate-900 dark:text-slate-100">Comments</h3>
        <span className="ml-auto bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                  {comment.author.firstName[0]}{comment.author.lastName[0]}
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {comment.author.firstName} {comment.author.lastName}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm p-3 rounded-tr-xl rounded-b-xl border border-slate-100 dark:border-slate-800/50">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type a comment..."
            className="pr-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-full"
            disabled={submitting}
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 top-1 h-8 w-8 rounded-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
            disabled={submitting || !newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
