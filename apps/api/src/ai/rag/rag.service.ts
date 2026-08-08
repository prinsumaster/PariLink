import {
  ServiceUnavailableException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenAIEmbeddings } from '@langchain/openai';

export interface RagCitation {
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  relevanceScore: number;
  snippet: string;
}

export interface RagResult {
  context: string;
  citations: RagCitation[];
}

@Injectable()
export class EnterpriseRagService {
  private readonly logger = new Logger(EnterpriseRagService.name);

  private _embeddings: OpenAIEmbeddings;

  private get embeddings(): OpenAIEmbeddings {
    if (!this._embeddings) {
      this._embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY || 'dummy-key-to-allow-boot',
        modelName: 'text-embedding-3-small',
      });
    }
    return this._embeddings;
  }

  constructor(private readonly prisma: PrismaService) {}

  private async getEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY) {
      throw new ServiceUnavailableException(
        'OpenAI API Key is required for RAG context retrieval.',
      );
    }
    return this.embeddings.embedQuery(text);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * BM25-style keyword scoring (simple term frequency approach)
   */
  private keywordScore(query: string, text: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const textLower = text.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      const occurrences = (textLower.match(new RegExp(term, 'g')) || []).length;
      // Normalized TF
      score += occurrences / (occurrences + 1.5);
    }
    return score / Math.max(queryTerms.length, 1);
  }

  /**
   * Tenant-isolated, permission-aware hybrid search (semantic + keyword).
   * Returns context string + citations for the calling agent/copilot.
   */
  async retrieveContext(
    query: string,
    options: {
      companyId?: string;
      limit?: number;
      permissionTags?: string[];
      semanticWeight?: number; // 0–1, defaults to 0.7
    } = {},
  ): Promise<RagResult> {
    const {
      companyId,
      limit = 5,
      permissionTags = [],
      semanticWeight = 0.7,
    } = options;

    this.logger.log(
      `RAG retrieval — query: "${query.substring(0, 80)}", company: ${companyId || 'global'}`,
    );

    const queryVector = await this.getEmbedding(query);

    // Tenant-isolated fetch
    const whereClause: any = {};
    if (companyId) {
      whereClause.document = { companyId };
    }
    if (permissionTags.length > 0) {
      // Only return chunks whose document does NOT have restricted tags
      // that the caller doesn't possess
      whereClause.document = {
        ...whereClause.document,
        // permissionTag must be in caller's permissionTags OR be null/empty
        OR: [
          { permissionTag: null },
          { permissionTag: '' },
          { permissionTag: { in: permissionTags } },
        ],
      };
    }

    let chunks: any[] = [];
    try {
      chunks = await this.prisma.runAsSystem(async (tx) =>
        tx.knowledgeChunk.findMany({
          where: whereClause,
          include: { document: true },
          take: 200, // Fetch candidates, rank in memory
        }),
      );
    } catch {
      this.logger.warn(
        'KnowledgeChunk table not available — returning empty context',
      );
      return {
        context: '[System: No knowledge base configured yet.]',
        citations: [],
      };
    }

    if (chunks.length === 0) {
      return {
        context: `[System: No documents found in the knowledge base${companyId ? ' for this organization' : ''}.]`,
        citations: [],
      };
    }

    // Hybrid scoring: weighted combination of semantic + keyword scores
    const keywordWeight = 1 - semanticWeight;
    const scoredChunks = chunks
      .map((chunk) => {
        const semantic = this.cosineSimilarity(
          queryVector,
          chunk.embedding as number[],
        );
        const keyword = this.keywordScore(query, chunk.content);
        const hybridScore = semantic * semanticWeight + keyword * keywordWeight;
        return { chunk, score: hybridScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const citations: RagCitation[] = scoredChunks.map(
      ({ chunk, score }, idx) => ({
        documentId: chunk.documentId,
        documentTitle: chunk.document?.title || 'Unknown Document',
        chunkIndex: chunk.chunkIndex ?? idx,
        relevanceScore: Math.round(score * 1000) / 1000,
        snippet:
          chunk.content.substring(0, 150) +
          (chunk.content.length > 150 ? '...' : ''),
      }),
    );

    const contextParts = scoredChunks.map(
      ({ chunk, score }) =>
        `[Source: "${chunk.document?.title || 'Unknown'}" | Relevance: ${(score * 100).toFixed(1)}%]\n${chunk.content}`,
    );

    return {
      context: contextParts.join('\n\n---\n\n'),
      citations,
    };
  }

  /**
   * Legacy compatibility shim — returns just the context string
   */
  async retrieveContextLegacy(query: string, limit = 3): Promise<string> {
    const result = await this.retrieveContext(query, { limit });
    return result.context;
  }
}
