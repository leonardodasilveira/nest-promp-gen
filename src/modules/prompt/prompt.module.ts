import { Module } from '@nestjs/common';
import { PromptContextBuilderService } from './prompt-context-builder.service';

@Module({
    providers: [PromptContextBuilderService],
    exports: [PromptContextBuilderService],
})
export class PromptModule {}