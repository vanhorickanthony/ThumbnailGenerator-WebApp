interface IBucketItem
{
	ETag: string[];
	key: string[];
	LastModified: string[];
	Owner: [
		{
			DisplayName: string[],
			ID: string[],
		}
	];
	Size: string[];
	StorageClass: string[];
}

export
{
	IBucketItem,
};
