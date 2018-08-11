import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';

import {
  InputPromptComponent,
  LoadingMessageComponent,
  PromptComponent
} from './components';

@NgModule({
  declarations: [
    InputPromptComponent,
    LoadingMessageComponent,
    PromptComponent
  ],
  entryComponents: [
    InputPromptComponent,
    PromptComponent
  ],
  exports: [
    /* Angular */
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule,

    /* Components */
    InputPromptComponent,
    LoadingMessageComponent,
    PromptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
