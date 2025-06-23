interface QueryParams {
  limit?: number;
  offset?: string;
}

export const parseQueryParameters = (
  queryStringParameters: Record<string, string | undefined> | undefined,
): QueryParams => {
  const params: QueryParams = {};

  if (!queryStringParameters) {
    return params;
  }

  if (queryStringParameters.limit) {
    const parsedLimit = parseInt(queryStringParameters.limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      params.limit = parsedLimit;
    }
  }

  if (queryStringParameters.offset) {
    params.offset = queryStringParameters.offset;
  }

  return params;
};
