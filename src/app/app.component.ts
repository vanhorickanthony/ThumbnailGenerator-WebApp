import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash'

import { ApiService } from './services/api.service';

import { IBucketList } from './models/API/bucket_list.model';

@Component(
	{
		selector: 'app-root',
		templateUrl: './app.component.html',
		styleUrls: ['./app.component.css']
	}
)

export class AppComponent
{
	lodash = _;

	title = 'ThumbnailGen';

	@ViewChild('imageUploadLabel') imageUploadLabel: ElementRef;

	thumbnailList: IBucketList = null;

	uploadForm = this.FB.group(
		{
			email: ['', Validators.required],
			image: ['', Validators.required],
			imageSource: [''],
		}
	);

	constructor(private ApiSrv: ApiService, private FB: FormBuilder)
	{
		this.ApiSrv.getListSignedUrl$().subscribe(
			signedUrl =>
			{
				console.log(
					{
						msg: 'Successfully retrieved signed URL for listing.',
						result: signedUrl,
					}
				)

				this.ApiSrv.listObjects$(signedUrl).subscribe(
					objectList =>
					{
						console.log(
							{
								msg: 'Successfully retrieved objects.',
								result: objectList.ListBucketResult,
							}
						)

						this.thumbnailList = objectList.ListBucketResult;
					}
				)

			}
		)
	}


	public onFileChanged(event): void
	{
		if (event.target.files.length > 0)
		{
			console.log(event.target.files[0]);
			this.uploadForm.patchValue({imageSource: event.target.files[0]});

			this.imageUploadLabel.nativeElement.innerText = event.target.files[0].name;
		}
	}

	public onFileUpload(): void
	{
		console.log('Requesting URL...');
		console.log(this.uploadForm.value);

		this.ApiSrv.getUploadSignedUrl$().subscribe(
			result =>
			{
				console.log(result);
				console.log(Date.now());

				const imageFormData = new FormData();

				const originalFile = this.uploadForm.get('imageSource').value;

				imageFormData.append('file', originalFile);

				this.ApiSrv.uploadFileToSignedUrl$(result, originalFile).subscribe(
					uploadResponse =>
					{
						console.log(uploadResponse);
					}
				);
			}
		);
	}
}
