import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';


import { ApiService } from './services/api.service';

@Component(
	{
		selector: 'app-root',
		templateUrl: './app.component.html',
		styleUrls: ['./app.component.css']
	}
)

export class AppComponent
{
	title = 'ThumbnailGen';

	@ViewChild('imageUploadLabel') imageUploadLabel: ElementRef;

	uploadForm = this.FB.group(
		{
			email: ['', Validators.required],
			image: ['', Validators.required],
			imageSource: [''],
		}
	);

	constructor(private ApiSrv: ApiService, private FB: FormBuilder)
	{

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

		this.ApiSrv.getSignedUrl$().subscribe(
			result =>
			{
				console.log(result);
				console.log(Date.now());

				const imageFormData = new FormData();

				const originalFile = this.uploadForm.get('imageSource').value;

				const blob = originalFile.slice(0, originalFile.size, 'image/png');

				const uploadableFile = new File(
					[blob],
					`${result.photoFilename}.png`,
					{
						type: 'image/png'
					}
				);

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
