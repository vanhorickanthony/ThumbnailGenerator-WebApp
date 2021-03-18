interface IRequestState
{
	authenticated: boolean;

	requestInProgress: boolean;

	requestSuccessful: boolean;
	requestFailed: boolean;

	urlListReceived: boolean;
	objectListReceived: boolean;
}

export
{
	IRequestState,
};
