/**
 * This file contains the interfaces used in the application.
 * It includes the ArticleResponse interface, which defines the structure of the
 * response from the API, and the Article interface, which defines the structure
 * of an article object.
 */

interface Meta {
  count?: number;
  title: string;
  url: string;
}

export interface Article {
  id?: number,
  createdAt?: Date,
  title: string,
  author: string,
  date: string,
  categoryId: number,
  image: string
  intro: string
}

export interface ArticleResponse{
  meta?: Meta;
  data?: Article[]
  error?: unknown;
}
