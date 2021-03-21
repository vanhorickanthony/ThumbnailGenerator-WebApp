import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';

import { Env } from '../config/env.config';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUploadUrl } from '../models/API/uploadurl.model';
import { IListUrl } from '../models/API/listurl.model';
import {ISignedUrl} from '../models/API/signed_url.model';

@Injectable(
	{
		providedIn: 'root'
	}
)

export class ApiService {
	constructor(private HttpSrv: HttpClient)
	{

	}

	getUploadSignedUrl$(mail: string, code: string, slack_webhook?: string): Observable<IUploadUrl>
	{
		return this.HttpSrv.get<IUploadUrl>(
			`${Env.ApiGatewayUrl}/uploadUrl?email=${mail}&code=${code}&slack_webhook=${slack_webhook}`
		);
	}

	getOwnedObjectsSignedUrls$(email: string, code: string): Observable<ISignedUrl[]>
	{
		return this.HttpSrv.get<ISignedUrl[]>(`${Env.ApiGatewayUrl}/thumbnails/ownedObjects?email=${email}&code=${code}`);
	}

	getObject$(signedUrl: ISignedUrl): Observable<any>
	{
		return this.HttpSrv.get<any>(
			`${signedUrl.url}`,
			{
				headers:
					{
						'Bucket': 'thumbgen-uploads',
					},
				responseType: 'blob' as 'json',
			}
		);

	}

	uploadFileToSignedUrl$(signedUrl: IUploadUrl, file: File, userHash: string, slack_webhook?: string): Observable<any>
	{
		return this.HttpSrv.put<any>(
			`${signedUrl.uploadURL}`, file,
			{
				headers:
					{
						'Bucket': 'thumbgen-uploads',
						'Content-Type': 'image/png',
						'Key': `${signedUrl.photoFilename}.png`,
						'x-amz-meta-hash': userHash,
						'x-amz-meta-slack_webhook': slack_webhook? slack_webhook: '',
					}
			}
		);
	}
}
