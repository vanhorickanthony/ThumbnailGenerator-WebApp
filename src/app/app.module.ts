import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { CommonModule } from '@angular/common';

@NgModule(
	{
		declarations:
			[
				AppComponent
			],
		imports:
			[
				CommonModule,
				FormsModule,
				ReactiveFormsModule,
				HttpClientModule,
				BrowserModule
			],
		providers:
			[
			],
		bootstrap:
			[
				AppComponent
			]
})
export class AppModule { }
