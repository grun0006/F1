import { ArticleResponse } from './interfaces.js';

/**
 * Function to get data from a server
 * @param {string} url The URL to fetch data from.
 * @returns {Promise<ArticleResponse>} A promise that resolves to the API response
 * containing the data or an error.
 */
export const getData = async (url: string): Promise<ArticleResponse> => {
  try {
    const res: Response = await fetch(url);
    const items: ArticleResponse = await res.json();
    return items;
  } catch (error) {
    return {
      error,
    };
  }
};

/**
 * Function to get all data from different urls
 * @param {string} appUrlsData An array of URL paths to fetch data from.
 * @returns {Promise<ArticleResponse[]>} A promise that resolves to an array of
 * ArticleResponse objects from the provided URLs.
 */
export const getAllDataFromDifferentUrls = async (
  appUrlsData: string[]
): Promise<ArticleResponse[]> => {
  // setup the promises
  const promises: Promise<ArticleResponse>[] = appUrlsData.map((url: string) =>
    getData(`http://localhost:3010${url}`)
  );
  // fetch all appointments
  try {
    const items: ArticleResponse[] = await Promise.all(promises);
    return items;
  } catch (error: unknown) {
    console.log('🐮', error);
    return [{ error }];
  }
};
