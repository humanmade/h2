export const apiResponse = ( data, loading = false ) => {
	return {
		isLoading: loading,
		data,
	};
};
