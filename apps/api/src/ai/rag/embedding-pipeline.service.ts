import {
  ServiceUnavailableException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class EmbeddingPipelineService {
  private readonly logger = new Logger(EmbeddingPipelineService.name);
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

  /**
   * Mocks embedding generation if no API key is provided,
   * otherwise uses OpenAI Embeddings.
   */
  private async getEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY) {
      throw new ServiceUnavailableException(
        'OpenAI API Key is required for generating embeddings.',
      );
    }
    return this.embeddings.embedQuery(text);
  }

  async indexDocument(
    title: string,
    content: string,
    sourceType: string,
    metadata: any = {},
  ) {
    this.logger.log(`Indexing document: ${title}`);

    // 1. Create Document Record
    const doc = await this.prisma.runAsSystem(async (tx) =>
      tx.knowledgeDocument.create({
        data: { title, content, sourceType, metadata },
      }),
    );

    // 2. Chunking (Naive text splitter for MVP)
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.substring(i, i + chunkSize));
    }

    // 3. Generate Embeddings & Store Chunks
    for (const chunkText of chunks) {
      const vector = await this.getEmbedding(chunkText);
      await this.prisma.runAsSystem(async (tx) =>
        tx.knowledgeChunk.create({
          data: {
            documentId: doc.id,
            content: chunkText,
            embedding: vector,
            metadata: {},
          },
        }),
      );
    }

    this.logger.log(`Indexed ${chunks.length} chunks for document: ${title}`);
    return doc;
  }
}
