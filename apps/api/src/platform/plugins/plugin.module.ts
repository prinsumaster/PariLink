import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ExecutionModule } from '../../automation/execution/execution.module';
import { PluginRegistry } from './plugin.registry';
import { PluginRuntimeManager } from './runtime/plugin-runtime.manager';
import { PermissionValidator } from './runtime/permission-validator';

@Module({
  imports: [PrismaModule, ExecutionModule],
  providers: [PluginRegistry, PluginRuntimeManager, PermissionValidator],
  exports: [PluginRegistry, PluginRuntimeManager, PermissionValidator],
})
export class PluginModule {}
