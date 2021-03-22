import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash'

import { faCloudDownloadAlt, faSync } from '@fortawesome/free-solid-svg-icons';

import { ApiService } from './services/api.service';

import { IBucketList } from './models/API/bucket_list.model';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {IRequestState} from './models/internal/thumbnailrequest.state.model';

import { Observable, forkJoin } from 'rxjs';
import {ISignedUrl} from './models/API/signed_url.model';

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

	@ViewChild('imageUploadButton') imageUploadButton: ElementRef;
	@ViewChild('imageUploadLabel') imageUploadLabel: ElementRef;

	@ViewChild('syncStatus') syncStatus: FaIconComponent;
	@ViewChild('syncButton') syncButton: ElementRef;


	/**
	 * Album state
	 */

	thumbnailList: ISignedUrl[];

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
			slack_webhook: [''],
			image: ['', Validators.required],
			imageSource: ['', Validators.required],
		}
	);

	requestedThumbnailData: boolean = false;

	requestState: IRequestState =
		{
			authenticated: false,

			requestInProgress: false,

			requestSuccessful: false,
			requestFailed: false,

			urlListReceived: false,
			objectListReceived: false,
		}

	constructor(private ApiSrv: ApiService, private FB: FormBuilder)
	{
		this.thumbnailList = [];
	}

     public CheckFileExist(r):boolean{
		 for(var ii = 0; ii < this.thumbnailList.length; ii++){
		 	if (this.thumbnailList[ii].key == r.slice(0,-4)+".jpg"){
		 		return true;
			}
		 }
      return false;
	 }

	 public FindLink(r): string {
		 const originalDatestamp = r.replace(/\D/g,'');
		for(let t of this.thumbnailList){
      	const newDatestamp = t.key.replace(/\D/g,'');
      	if ((originalDatestamp == newDatestamp) && t.isProcessed){
			return t.url;
		 }
		}
		 return "#";
	 }

	public checkAuthentication(): void
	{
		if (this.uploadForm.get('email').value != '' &&
			this.uploadForm.get('code').value !== '' &&
			this.uploadForm.get('email').valid &&
			this.uploadForm.get('code').valid)
		{
			this.requestState.authenticated = true;
		}
	}

	public checkFileState(): boolean
	{
		return this.uploadForm.get('imageSource').valid;

	}

	public syncThumbnails(): void
	{
		console.log("Syncing thumbnails...");

		this.checkAuthentication();

		if (this.requestState.authenticated)
		{
			this.setSyncActive();

			this.requestState.requestInProgress = true;

			this.ApiSrv.getOwnedObjectsSignedUrls$(
				this.uploadForm.get('email').value,
				this.uploadForm.get('code').value,
			).subscribe(
				signedUrlList =>
				{
					this.requestState.urlListReceived = true;

					this.thumbnailList = signedUrlList;

					this.requestState.requestSuccessful = true;

					this.requestState.objectListReceived = true;

					this.requestState.requestInProgress = false;

					this.setSyncInactive()
				}
			);
		}
	}

	public lockUpload(): void
	{
		this.imageUploadButton.nativeElement.disabled = true;
	}

	public unlockUpload(): void
	{
		this.imageUploadButton.nativeElement.disabled = false;

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

		this.checkAuthentication();

		if (this.requestState.authenticated && this.checkFileState())
		{
			this.lockUpload();

			this.ApiSrv.getUploadSignedUrl$(
				this.uploadForm.get('email').value,
				this.uploadForm.get('code').value,
				this.uploadForm.get('slack_webhook').value,
			).subscribe(
				result =>
				{

					const imageFormData = new FormData();

					const originalFile = this.uploadForm.get('imageSource').value;

					imageFormData.append('file', originalFile);

					this.ApiSrv.uploadFileToSignedUrl$(result, originalFile, result.hash).subscribe(
						uploadResponse =>
						{
							console.log(uploadResponse);

							this.unlockUpload();
						}
					);
				}
			);
		}
	}

	public openImage(url: string): void
	{
		window.open(url, '_blank');
	}

	public downloadImage(url: ISignedUrl): void
	{
		this.ApiSrv.getObject$(url).subscribe(
			result =>
			{

				console.info(result);

				let url = window.URL.createObjectURL(result);

				window.open(url);
			}
		)
	}
}
