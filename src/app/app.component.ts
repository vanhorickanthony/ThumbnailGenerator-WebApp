import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash'

import { faCloudDownloadAlt, faSync } from '@fortawesome/free-solid-svg-icons';

import { ApiService } from './services/api.service';

import { IBucketList } from './models/API/bucket_list.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

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
	@ViewChild('syncStatus') syncStatus: FaIconComponent;
	@ViewChild('syncButton') syncButton: ElementRef;

	thumbnailList: IBucketList = null;

	/**
	 * FontAwesome icons
	 */
	faCloudDownload = faCloudDownloadAlt;
	faSync = faSync;

	/**
	 * Form state.
	 */

	uploadForm = this.FB.group(
		{
			email: ['', Validators.required],
			code: ['', Validators.required],
			image: ['', Validators.required],
			imageSource: [''],
		}
	);

	requestedThumbnailData: boolean = false;

	constructor(private ApiSrv: ApiService, private FB: FormBuilder)
	{
		this.ApiSrv.getOwnedObjectsSignedUrls$().subscribe(
			signedUrlList =>
			{
				console.log(signedUrlList);

				for (let signedUrl of signedUrlList)
				{
					this.ApiSrv.getObject$(signedUrl).subscribe(
						s3object =>
						{
							console.log(s3object);
						}
					)
				}
			}
		);
		/*
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

		 */
	}

	public syncThumbnails(): void
	{
		console.log("Syncing thumbnails...");

		this.setSyncActive();

		setTimeout( () =>
		{
			this.setSyncInactive();
		}, 1000);
	}

	public setSyncActive(): void
	{
		this.syncStatus.icon = this.faSync;
		this.syncStatus.spin = true;

		this.syncButton.nativeElement.innerText = 'Wait...'
		this.syncButton.nativeElement.disabled = true;

		this.syncStatus.render();
	}


	public setSyncInactive(): void
	{
		this.syncStatus.icon = this.faCloudDownload;
		this.syncStatus.spin = false;

		this.syncButton.nativeElement.innerText = 'Retrieve thumbnails.'
		this.syncButton.nativeElement.disabled = false;

		this.syncStatus.render();
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

		this.ApiSrv.getUploadSignedUrl$(this.uploadForm.get('email').value, this.uploadForm.get('code').value).subscribe(
			result =>
			{
				console.log(result);
				console.log(Date.now());

				const imageFormData = new FormData();

				const originalFile = this.uploadForm.get('imageSource').value;

				imageFormData.append('file', originalFile);

				this.ApiSrv.uploadFileToSignedUrl$(result, originalFile, result.hash).subscribe(
					uploadResponse =>
					{
						console.log(uploadResponse);
					}
				);
			}
		);
	}
}
