import { Injectable } from '@angular/core';

import { Env } from '../config/env.config';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUploadUrl } from '../models/API/uploadurl.model';

import * as S3 from 'aws-sdk/clients/s3';

@Injectable(
	{
		providedIn: 'root'
	}
)

export class ApiService
{
	constructor(private HttpSrv: HttpClient)
	{

	}

	getSignedUrl$(): Observable<IUploadUrl>
	{
		return this.HttpSrv.get<IUploadUrl>(`${Env.ApiGatewayUrl}/uploadUrl`);
	}

	uploadFileToSignedUrl$(signedUrl: IUploadUrl, file: File): Observable<any>
	{
		console.log(file);
		console.log(signedUrl);

		return this.HttpSrv.put<any>(
			`${signedUrl.uploadURL}`, file,
			{
				headers:
					{
						'Bucket': 'thumbgen-uploads',
						'Content-Type': 'image/png',
						'Key': `${signedUrl.photoFilename}.png`
					}
			}
		);

	}


}
