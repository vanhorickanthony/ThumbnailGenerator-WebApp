import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import * as xml2js from 'xml2js';

import { Env } from '../config/env.config';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUploadUrl } from '../models/API/uploadurl.model';
import { IListUrl } from '../models/API/listurl.model';

@Injectable(
	{
		providedIn: 'root'
	}
)

export class ApiService {
	constructor(private HttpSrv: HttpClient)
	{

	}

	getUploadSignedUrl$(): Observable<IUploadUrl>
	{
		return this.HttpSrv.get<IUploadUrl>(`${Env.ApiGatewayUrl}/uploadUrl`);
	}

	getListSignedUrl$(): Observable<IListUrl>
	{
		return this.HttpSrv.get<IListUrl>(`${Env.ApiGatewayUrl}/listUrl`);
	}

	listObjects$(signedUrl: IListUrl): Observable<any>
	{
		return this.HttpSrv.get<IListUrl>(
			`${signedUrl.signedUrl}`,
			{
				headers:
					{
						key: signedUrl.key,
					},
				responseType: 'text' as 'json',
			}
		).pipe(
			map(
				xmlResponse => {
					const parser: xml2js.Parser = new xml2js.Parser();

					let error;
					let result;

					parser.parseString(
						xmlResponse,
						(err, res) => {
							if (err)
							{
								console.log(
									{
										status: 'error',
										result: err,
									}
								)
								error = err;
							}
							else if (res)
							{
								console.log(res);

								result = res;
							}
						}
					);

					return error? error : result;
				}
			)
		);
	}

	uploadFileToSignedUrl$(signedUrl: IUploadUrl, file: File): Observable<any>
	{
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
