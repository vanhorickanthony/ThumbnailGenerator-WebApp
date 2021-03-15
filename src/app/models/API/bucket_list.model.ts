import { IBucketItem } from './bucket_item.model';

interface IBucketList
{
	Contents: IBucketItem[];
	Name: string[];
}

export
{
	IBucketList,
};
